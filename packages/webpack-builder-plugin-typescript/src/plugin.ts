import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin/lib";
import { Options as TsconfigPathsPluginOptions } from "tsconfig-paths-webpack-plugin/lib/options";
import { loadTsconfig, Tsconfig } from "tsconfig-paths/lib/tsconfig-loader";
import upath from "upath";
import * as fs from "fs-extra";
import { Plugin } from "@reactway/webpack-builder";
import { ForkTsCheckerWebpackPluginOptions } from "./plugin-options";

import "ts-loader";

// Extensions.
const TS_EXTENSION: string = ".ts";
const TSX_EXTENSION: string = ".tsx";
const JS_EXTENSION: string = ".js";
const JSX_EXTENSION: string = ".jsx";

// Tsconfig.
export const TS_CONFIG_NAME: string = "tsconfig.json";
const DEFAULT_TS_CONFIG_LOCATION: string = upath.resolve(__dirname, `../assets/${TS_CONFIG_NAME}`);

// TsLint.
export const TSLINT_CONFIG_NAME: string = "tslint.json";
const DEFAULT_TSLINT_CONFIG_LOCATION: string = upath.resolve(__dirname, `../assets/${TSLINT_CONFIG_NAME}`);

interface TypeScriptPluginOptions {
    forkTsCheckerOptions?: Partial<ForkTsCheckerWebpackPluginOptions>;
    tsconfigPathsPluginOptions?: Partial<TsconfigPathsPluginOptions>;
}

export const TypeScriptPlugin: Plugin<TypeScriptPluginOptions> = (config, projectDirectory) => {
    const fullTsconfigLocation = upath.resolve(projectDirectory, TS_CONFIG_NAME);
    let baseURLExist: boolean = false;

    try {
        checkTsConfig(projectDirectory);
    } catch (error) {
        console.error(`Failed while initiating "${TS_CONFIG_NAME}".`, error);
    }

    try {
        checkTslintConfig(projectDirectory);
    } catch (error) {
        console.error(`Failed while initiating "${TSLINT_CONFIG_NAME}".`, error);
    }

    const tsConfig: Tsconfig | undefined = loadTsconfig(fullTsconfigLocation);

    return webpack => {
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
                tslint: true,
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
                        plugins: ["syntax-dynamic-import"]
                    }
                },
                {
                    loader: "ts-loader",
                    options: {
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
                        presets: ["@babel/preset-env"]
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
            throw new Error(`Cannot add tsconfigPathsPluginOptions because baseUrl do not exist at ${TS_CONFIG_NAME}`);
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

        return webpack;
    };
};

export function checkTsConfig(projectDirectory: string): void {
    const configLocation = upath.resolve(projectDirectory, TS_CONFIG_NAME);

    if (!fs.pathExistsSync(configLocation)) {
        console.info(`File "${TS_CONFIG_NAME}" not found at ${configLocation}. Creating...`);
        fs.copySync(DEFAULT_TS_CONFIG_LOCATION, configLocation);
        console.info("Created.");
    }
}

export function checkTslintConfig(projectDirectory: string): void {
    const configLocation = upath.resolve(projectDirectory, TSLINT_CONFIG_NAME);

    if (!fs.pathExistsSync(configLocation)) {
        console.info(`File "${TSLINT_CONFIG_NAME}" not found at ${configLocation}. Creating...`);
        fs.copySync(DEFAULT_TSLINT_CONFIG_LOCATION, configLocation);
        console.info("Created.");
    }
}
