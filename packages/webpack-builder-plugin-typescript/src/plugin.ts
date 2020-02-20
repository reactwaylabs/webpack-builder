import { Plugin, Configuration } from "@reactway/webpack-builder";
import upath from "upath";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin/lib";
import { Options as TsconfigPathsPluginOptions } from "tsconfig-paths-webpack-plugin/lib/options";
import { loadTsconfig, Tsconfig } from "tsconfig-paths/lib/tsconfig-loader";
import { ForkTsCheckerWebpackPluginOptions } from "./plugin-options";
import TerserPlugin, { TerserPluginOptions } from "terser-webpack-plugin";

import "ts-loader";
import { LoaderOptions as TsLoaderOptions } from "ts-loader/dist/interfaces";
import { TS_CONFIG_NAME, checkTsConfig, TSLINT_CONFIG_NAME, checkTslintConfig } from "./checkers";

const enum Linter {
    TsLint = "tslint",
    EsLint = "eslint"
}

// Extensions.
const TS_EXTENSION: string = ".ts";
const TSX_EXTENSION: string = ".tsx";
const JS_EXTENSION: string = ".js";
const JSX_EXTENSION: string = ".jsx";

export interface TypeScriptPluginOptions {
    tsLoaderOptions?: Omit<Partial<TsLoaderOptions>, "happyPackMode" | "transpileOnly">;
    forkTsCheckerOptions?: Partial<ForkTsCheckerWebpackPluginOptions>;
    tsconfigPathsPluginOptions?: Partial<TsconfigPathsPluginOptions>;
    terserPluginOptions?: TerserPluginOptions;
    linter?: Linter;
    isEnvProduction?: boolean;
    shouldUseSourceMap?: boolean;
}

export const TypeScriptPlugin: Plugin<TypeScriptPluginOptions> = (
    config: TypeScriptPluginOptions | undefined,
    projectDirectory: string
) => {
    const fullTsconfigLocation = upath.resolve(projectDirectory, TS_CONFIG_NAME);
    let baseURLExist: boolean = false;

    const linter = config != null && config.linter != null ? config.linter : Linter.EsLint;

    try {
        checkTsConfig(projectDirectory);
    } catch (error) {
        console.error(`Failed while initiating "${TS_CONFIG_NAME}".`, error);
    }

    if (linter === Linter.TsLint) {
        try {
            checkTslintConfig(projectDirectory);
        } catch (error) {
            console.error(`Failed while initiating "${TSLINT_CONFIG_NAME}".`, error);
        }
    }

    const tsConfig: Tsconfig | undefined = loadTsconfig(fullTsconfigLocation);

    return (webpack: Configuration) => {
        if (webpack.plugins == null) {
            webpack.plugins = [];
        }

        webpack.devtool = "inline-source-map";

        let forkTsConfig: Partial<ForkTsCheckerWebpackPluginOptions> = {};
        if (config != null && config.forkTsCheckerOptions != null) {
            forkTsConfig = config.forkTsCheckerOptions;
        }

        webpack.plugins.push(
            new ForkTsCheckerWebpackPlugin({
                checkSyntacticErrors: true,
                tslint: linter === Linter.TsLint ? true : undefined,
                eslint: linter === Linter.EsLint ? true : undefined,
                ...forkTsConfig
            })
        );

        if (webpack.module == null) {
            webpack.module = {
                rules: []
            };
        }

        webpack.module.rules.push({
            test: /\.tsx?$/,
            use: [
                {
                    loader: "babel-loader",
                    options: {
                        babelrc: true,
                        plugins: ["syntax-dynamic-import"],
                        presets: ["@babel/preset-env"]
                    }
                },
                {
                    loader: "ts-loader",
                    options: {
                        ...config?.tsLoaderOptions,
                        // disable type checker - we will use it in fork plugin
                        // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
                        happyPackMode: true,
                        transpileOnly: true
                    }
                }
            ],
            exclude: /node_modules/
        });

        webpack.module.rules.push({
            test: /\.jsx?$/,
            use: [
                {
                    loader: "babel-loader",
                    options: {
                        babelrc: true,
                        plugins: ["syntax-dynamic-import"],
                        presets: ["@babel/preset-env"],
                        compact: true
                    }
                }
            ],
            include: /node_modules/
        });

        if (webpack.resolve == null) {
            webpack.resolve = {};
        }

        if (webpack.resolve.plugins == null) {
            webpack.resolve.plugins = [];
        }

        if (
            tsConfig != null &&
            tsConfig.compilerOptions != null &&
            tsConfig.compilerOptions.baseUrl != null &&
            tsConfig.compilerOptions.baseUrl.trim().length !== 0
        ) {
            let configToSpread = {};
            if (config != null && config.tsconfigPathsPluginOptions != null) {
                configToSpread = config.tsconfigPathsPluginOptions;
            }

            const defaultOptions: Partial<TsconfigPathsPluginOptions> = {
                configFile: fullTsconfigLocation,
                ...configToSpread
            };

            webpack.resolve.plugins.push(new TsconfigPathsPlugin(defaultOptions));

            baseURLExist = true;
        }

        if (!baseURLExist && config != null && config.tsconfigPathsPluginOptions != null) {
            throw new Error(`Cannot add tsconfigPathsPluginOptions because baseUrl does not exist at ${TS_CONFIG_NAME}`);
        }

        if (webpack.resolve.extensions == null) {
            webpack.resolve.extensions = [];
        }

        if (webpack.resolve.extensions.indexOf(TS_EXTENSION) === -1) {
            webpack.resolve.extensions.push(TS_EXTENSION);
        }

        if (tsConfig != null && tsConfig.compilerOptions != null) {
            // HACK: To get other compiler options properties.
            // tslint:disable-next-line:no-any
            const tsConfigCompilerOptions = tsConfig.compilerOptions as any;
            if (tsConfigCompilerOptions.jsx != null) {
                if (webpack.resolve.extensions.indexOf(TSX_EXTENSION) === -1) {
                    webpack.resolve.extensions.push(TSX_EXTENSION);
                }
                if (webpack.resolve.extensions.indexOf(JSX_EXTENSION) === -1) {
                    webpack.resolve.extensions.push(JSX_EXTENSION);
                }
            }
        }

        if (webpack.resolve.extensions.indexOf(JS_EXTENSION) === -1) {
            webpack.resolve.extensions.push(JS_EXTENSION);
        }

        if (webpack.optimization == null) {
            webpack.optimization = {};
        }

        webpack.optimization.minimize = config?.isEnvProduction ?? webpack.mode === "production";

        if (webpack.optimization.minimizer == null) {
            webpack.optimization.minimizer = [];
        }

        let terserOptions: TerserPluginOptions = {
            cache: true,
            parallel: true,
            terserOptions: {
                parse: {
                    // We want terser to parse ecma 8 code. However, we don't want it
                    // to apply any minification steps that turns valid ecma 5 code
                    // into invalid ecma 5 code. This is why the 'compress' and 'output'
                    // sections only apply transformations that are ecma 5 safe
                    // https://github.com/facebook/create-react-app/pull/4234
                    ecma: 8
                },
                compress: {
                    ecma: 5,
                    warnings: false,
                    dead_code: true,
                    conditionals: true,
                    booleans: true
                },
                mangle: {
                    safari10: true
                },
                module: false,
                output: {
                    ecma: 5,
                    comments: false,
                    // Turned on because emoji and regex is not minified properly using default
                    // https://github.com/facebook/create-react-app/issues/2488
                    ascii_only: true,
                    beautify: false
                }
            },
            sourceMap: config?.shouldUseSourceMap
        };

        if (config != null && config.terserPluginOptions != null) {
            terserOptions = config.terserPluginOptions;
        }

        webpack.optimization.minimizer.push(new TerserPlugin(terserOptions) as Plugin);

        return webpack;
    };
};
