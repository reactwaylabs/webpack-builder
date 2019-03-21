import upath from "upath";
import * as fs from "fs-extra";
import { Plugin } from "@reactway/webpack-builder";

// Extensions.
const CSS_EXTENSION: string = ".css";
const SCSS_EXTENSION: string = ".scss";

// Postcss.config.js
const POSTCSS_CONFIG_NAME: string = "postcss.config.js";
const DEFAULT_POSTCSS_CONFIG_LOCATION: string = upath.resolve(__dirname, `../assets/${POSTCSS_CONFIG_NAME}`);

// Fonts location.
const FONTS_OUTPUT_LOCATION: string = "./assets/fonts";
// Public path
const PUBLIC_PATH: string = "./";

// tslint:disable-next-line no-any
type OptionsDictionary = { [key: string]: any };

interface StylesPluginOptions {
    fontsOutputLocation?: string;
    fontsPublicPath?: string;
    urlLoaderOptions?: OptionsDictionary;
    styleLoaderOptions?: OptionsDictionary;
    cssLoaderOptions?: OptionsDictionary;
    postcssLoaderOptions?: OptionsDictionary;
    sassLoaderOptions?: OptionsDictionary;
}

export const StylesPlugin: Plugin<StylesPluginOptions> = (config, projectDirectory) => {
    try {
        checkPostCssConfig(projectDirectory);
    } catch (error) {
        console.error(`Failed while initiating "${POSTCSS_CONFIG_NAME}".`, error);
    }

    return webpack => {
        if (webpack.module == null) {
            webpack.module = {
                rules: []
            };
        }

        const fontsOutputLocation: string =
            config != null && config.fontsOutputLocation != null ? config.fontsOutputLocation : FONTS_OUTPUT_LOCATION;

        const fontsPublicPath: string = config != null && config.fontsPublicPath != null ? config.fontsPublicPath : PUBLIC_PATH;

        let urlLoaderOptions: OptionsDictionary = {};
        if (config != null && config.urlLoaderOptions != null) {
            urlLoaderOptions = config.urlLoaderOptions;
        }

        let styleLoaderOptions: OptionsDictionary = {};
        if (config != null && config.styleLoaderOptions != null) {
            styleLoaderOptions = config.styleLoaderOptions;
        }

        let cssLoaderOptions: OptionsDictionary = {};
        if (config != null && config.cssLoaderOptions != null) {
            cssLoaderOptions = config.cssLoaderOptions;
        }

        let postcssLoaderOptions: OptionsDictionary = {};
        if (config != null && config.postcssLoaderOptions != null) {
            postcssLoaderOptions = config.postcssLoaderOptions;
        }

        let sassLoaderOptions: OptionsDictionary = {};
        if (config != null && config.sassLoaderOptions != null) {
            sassLoaderOptions = config.sassLoaderOptions;
        }

        // TODO: Make options pass from user.
        webpack.module.rules.push(
            {
                test: /\.scss$/,
                use: [
                    {
                        // Creates style nodes from JS strings.
                        loader: "style-loader",
                        options: { ...styleLoaderOptions }
                    },
                    // // Translates CSS into CommonJS.
                    // "css-loader",
                    // Autoprefixer
                    { loader: "postcss-loader", options: { ...postcssLoaderOptions } },
                    // Compiles Sass to CSS.
                    {
                        loader: "sass-loader",
                        options: { ...sassLoaderOptions }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader",
                        options: { ...styleLoaderOptions }
                    },
                    {
                        loader: "css-loader",
                        options: { ...cssLoaderOptions }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: "url-loader",
                options: {
                    name: `${fontsOutputLocation}/[name].[ext]`,
                    publicPath: fontsPublicPath,
                    limit: 10000,
                    ...urlLoaderOptions
                }
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

        return webpack;
    };
};

export function checkPostCssConfig(projectDirectory: string): void {
    const configLocation = upath.resolve(projectDirectory, POSTCSS_CONFIG_NAME);

    if (!fs.pathExistsSync(configLocation)) {
        console.info(`File "${POSTCSS_CONFIG_NAME}" not found at ${configLocation}. Creating...`);
        fs.copySync(DEFAULT_POSTCSS_CONFIG_LOCATION, configLocation);
        console.info("Created.");
    }
}
