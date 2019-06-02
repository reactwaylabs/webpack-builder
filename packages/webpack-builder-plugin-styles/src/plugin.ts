import Webpack from "webpack";
import * as upath from "upath";
import * as fs from "fs-extra";
import queryString from "query-string";
import { Plugin } from "@reactway/webpack-builder";
import MiniCssExtractPlugin, { PluginOptions as MiniCssExtractPluginOptions } from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin, { Options as OptimizeCSSOptions } from "optimize-css-assets-webpack-plugin";

// Extensions.
const CSS_EXTENSION: string = ".css";
const SCSS_EXTENSION: string = ".scss";

// Postcss.config.js
const POSTCSS_CONFIG_NAME: string = "postcss.config.js";

// Fonts location.
const FONTS_OUTPUT_LOCATION: string = "./assets/fonts";
// Public path
const PUBLIC_PATH: string = "./";

type Omit<TType, TKey extends keyof TType> = Pick<TType, Exclude<keyof TType, TKey>>;
type LoaderOptions = Omit<Webpack.RuleSetLoader, "loader">;

// Webpack.RuleSetQuery | undefined
type PostCssOptions = { [k: string]: any };
type PostCssPluginsFn = (...args: unknown[]) => unknown[];

interface StylesPluginOptions {
    fontsOutputLocation?: string;
    fontsPublicPath?: string;
    urlLoaderOptions?: LoaderOptions;
    styleLoaderOptions?: LoaderOptions;
    cssLoaderOptions?: LoaderOptions;
    postcssLoaderOptions?: LoaderOptions;
    sassLoaderOptions?: LoaderOptions;
    optimizeCssAssetsPlugin?: OptimizeCSSOptions;
    miniCssExtractPluginOptions?: MiniCssExtractPluginOptions;
}

export const StylesPlugin: Plugin<StylesPluginOptions> = (config, projectDirectory) => {
    checkPostCssConfig(projectDirectory);

    return webpack => {
        if (webpack.mode === "production") {
            if (webpack.plugins == null) {
                webpack.plugins = [];
            }

            let miniCssExtractPluginOptions: MiniCssExtractPluginOptions = {
                filename: "[name].[chunkhash].css",
                chunkFilename: "[name].[contenthash].css"
            };

            if (config != null && config.miniCssExtractPluginOptions != null) {
                miniCssExtractPluginOptions = config.miniCssExtractPluginOptions;
            }

            webpack.plugins.push(new MiniCssExtractPlugin(miniCssExtractPluginOptions) as Plugin);
        }

        if (webpack.module == null) {
            webpack.module = {
                rules: []
            };
        }

        const fontsOutputLocation: string =
            config != null && config.fontsOutputLocation != null ? config.fontsOutputLocation : FONTS_OUTPUT_LOCATION;

        const fontsPublicPath: string = config != null && config.fontsPublicPath != null ? config.fontsPublicPath : PUBLIC_PATH;

        const baseUrlLoaderOptions = {
            name: `${fontsOutputLocation}/[name].[ext]`,
            publicPath: fontsPublicPath,
            limit: 10000
        };

        const urlLoaderOptions: LoaderOptions = {
            options: {
                ...baseUrlLoaderOptions
            }
        };

        if (config != null && config.urlLoaderOptions != null) {
            const urlOptions = config.urlLoaderOptions.options;
            if (typeof urlOptions === "object") {
                urlLoaderOptions.options = {
                    ...baseUrlLoaderOptions,
                    ...urlOptions
                };
            }

            if (typeof urlOptions === "string") {
                urlLoaderOptions.options = urlOptions;
            }

            urlLoaderOptions.ident = config.urlLoaderOptions.ident;
            urlLoaderOptions.query = config.urlLoaderOptions.query;
        }

        let styleLoaderOptions: LoaderOptions = {};
        if (config != null && config.styleLoaderOptions != null) {
            styleLoaderOptions = config.styleLoaderOptions;
        }

        let cssLoaderOptions: LoaderOptions = {};
        if (config != null && config.cssLoaderOptions != null) {
            cssLoaderOptions = config.cssLoaderOptions;
        }

        let postcssLoaderOptions: LoaderOptions = {};
        if (config != null && config.postcssLoaderOptions != null) {
            postcssLoaderOptions = config.postcssLoaderOptions;
        }
        // Extract post-css options out loader options
        let postCssOptions: PostCssOptions = {};
        if (postcssLoaderOptions.options != null) {
            let options = postcssLoaderOptions.options;
            if (typeof options === "object") {
                postCssOptions = options;
            }

            if (typeof options === "string") {
                postCssOptions = queryString.parse(options);
            }
        }

        let postCssPlugins: PostCssPluginsFn | unknown[] | undefined = postCssOptions.plugins;
        // Default autoprefixer.
        const autoprefixerRequire = require("autoprefixer")();
        if (postCssPlugins == null) {
            postCssPlugins = [autoprefixerRequire];
        } else {
            const definedPostCssPlugins = postCssPlugins;
            if (Array.isArray(postCssPlugins)) {
                postCssPlugins = [...postCssPlugins, autoprefixerRequire];
            } else {
                const pluginsFn = definedPostCssPlugins as PostCssPluginsFn;
                postCssPlugins = (...args: unknown[]) => {
                    return [...pluginsFn(args), autoprefixerRequire];
                };
            }
        }

        postcssLoaderOptions.options = {
            ...postCssOptions,
            plugins: postCssPlugins
        };

        let sassLoaderOptions: LoaderOptions = {};
        if (config != null && config.sassLoaderOptions != null) {
            sassLoaderOptions = config.sassLoaderOptions;
        }

        const webpackRulesSet: Webpack.RuleSetUse = [
            {
                // Creates style nodes from JS strings.
                loader: "style-loader",
                ...styleLoaderOptions
            },
            {
                // "css-loader",
                loader: "css-loader",
                ...cssLoaderOptions
            },
            // // Translates CSS into CommonJS.
            // Autoprefixer
            {
                loader: "postcss-loader",
                ...postcssLoaderOptions
            },
            // Compiles Sass to CSS.
            {
                loader: "sass-loader",
                ...sassLoaderOptions
            }
        ];

        // If it is a `production` mode webpack then we need `MiniCssExtractPlugin` add after `styles` loader (it crashes if we put before).
        if (webpack.mode === "production") {
            webpackRulesSet.splice(1, 0, MiniCssExtractPlugin.loader);
        }

        webpack.module.rules.push(
            {
                test: /\.(sa|sc|c)ss$/,
                use: [...webpackRulesSet]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: "url-loader",
                        ...urlLoaderOptions
                    }
                ]
            }
        );

        if (webpack.resolve == null) {
            webpack.resolve = {};
        }

        if (webpack.resolve.extensions == null) {
            webpack.resolve.extensions = [];
        }

        if (webpack.resolve.extensions.indexOf(CSS_EXTENSION) === -1) {
            webpack.resolve.extensions.push(CSS_EXTENSION);
        }

        if (webpack.resolve.extensions.indexOf(SCSS_EXTENSION) === -1) {
            webpack.resolve.extensions.push(SCSS_EXTENSION);
        }

        if (webpack.mode === "production") {
            if (webpack.optimization == null) {
                webpack.optimization = {};
            }

            if (webpack.optimization.minimizer == null) {
                webpack.optimization.minimizer = [];
            }

            webpack.optimization.minimizer.push(new OptimizeCSSAssetsPlugin(config == null ? undefined : config.optimizeCssAssetsPlugin));
        }

        return webpack;
    };
};

export function checkPostCssConfig(projectDirectory: string): void {
    const configLocation = upath.resolve(projectDirectory, POSTCSS_CONFIG_NAME);

    if (!fs.pathExistsSync(configLocation)) {
        console.warn(`${POSTCSS_CONFIG_NAME} was not found at project directory.`);
    }
}
