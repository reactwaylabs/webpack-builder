import MiniCssExtractPlugin from "mini-css-extract-plugin";

MiniCssExtractPlugin.loader = "";

jest.mock("optimize-css-assets-webpack-plugin");
jest.mock("upath", () => ({
    ...jest.requireActual("upath"),
    resolve: (...pathSegments: string[]) => pathSegments.join("//"),
    join: (...pathSegments: string[]) => pathSegments.join("//")
}));

import { Builder, Configuration } from "@reactway/webpack-builder";
import * as upath from "upath";
import * as fs from "fs-extra";
import { StylesPlugin } from "../plugin";

const path = "./src/__tests__/";
let SAMPLE_CONFIGURATION: Configuration = {};
const TEST_PROJECT_LOCATION: string = upath.resolve(path, "./test-project");

describe("production", () => {
    beforeEach(() => {
        SAMPLE_CONFIGURATION = {
            entry: "./src/index.ts",
            mode: "production",
            output: {
                path: upath.resolve(TEST_PROJECT_LOCATION, "dist"),
                filename: "[name].bundle.js",
                chunkFilename: "[name].bundle.js",
                publicPath: "./"
            }
        };
    });

    it("Adding styles plugin to configuration in production mode", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(StylesPlugin).toConfig();
        expect(configuration).toMatchSnapshot();
    });

    it("Adding styles plugin to configuration with optimization exist in production mode", () => {
        SAMPLE_CONFIGURATION = {
            ...SAMPLE_CONFIGURATION,
            optimization: {
                minimizer: []
            }
        };
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(StylesPlugin).toConfig();
        expect(configuration).toMatchSnapshot();
    });

    it("Adding styles plugin to configuration with mini css options", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
            .use(StylesPlugin, {
                miniCssExtractPluginOptions: {
                    filename: "[name].[chunkhash].css",
                    chunkFilename: "[name].[contenthash].css"
                }
            })
            .toConfig();
        expect(configuration).toMatchSnapshot();
    });
});

describe("development", () => {
    beforeEach(() => {
        SAMPLE_CONFIGURATION = {
            entry: "./src/index.ts",
            mode: "development",
            output: {
                path: upath.resolve(TEST_PROJECT_LOCATION, "dist"),
                filename: "[name].bundle.js",
                chunkFilename: "[name].bundle.js",
                publicPath: "./"
            }
        };
    });

    it("Adding styles plugin to configuration", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(StylesPlugin).toConfig();
        expect(configuration).toMatchSnapshot();
    });

    it("Adding styles plugin with resolve and extensions exists to configuration", () => {
        SAMPLE_CONFIGURATION = {
            ...SAMPLE_CONFIGURATION,
            resolve: {
                extensions: [".css", ".scss"]
            }
        };
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(StylesPlugin).toConfig();
        expect(configuration).toMatchSnapshot();
    });

    it("Adding styles plugin with fontsOutputLocation to configuration", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
            .use(StylesPlugin, { fontsOutputLocation: "../assets/fonts" })
            .toConfig();
        expect(configuration).toMatchSnapshot();
    });

    it("Adding styles plugin with options to configuration", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
            .use(StylesPlugin, { fontsPublicPath: "../plugins" })
            .toConfig();

        expect(configuration).toMatchSnapshot();
    });

    it("Adding styles plugin with url options as object to configuration", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
            .use(StylesPlugin, {
                urlLoaderOptions: {
                    options: {
                        limit: 8192
                    }
                }
            })
            .toConfig();
        expect(configuration).toMatchSnapshot();
    });
    it("Adding styles plugin with url options as string to configuration", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
            .use(StylesPlugin, {
                urlLoaderOptions: {
                    options: "?limit=8192"
                }
            })
            .toConfig();
        expect(configuration).toMatchSnapshot();
    });

    it("Adding styles plugin with style options to configuration", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
            .use(StylesPlugin, {
                styleLoaderOptions: {
                    options: {
                        hmr: false
                    }
                }
            })
            .toConfig();
        expect(configuration).toMatchSnapshot();
    });

    it("Adding styles plugin with css options to configuration", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
            .use(StylesPlugin, {
                cssLoaderOptions: {
                    options: {
                        url: true
                    }
                }
            })
            .toConfig();
        expect(configuration).toMatchSnapshot();
    });

    it("Adding styles plugin with post css options to configuration", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
            .use(StylesPlugin, {
                postcssLoaderOptions: {
                    options: {
                        url: true
                    }
                }
            })
            .toConfig();
        expect(configuration).toMatchSnapshot();
    });

    it("Adding styles plugin with post sass options to configuration", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
            .use(StylesPlugin, {
                sassLoaderOptions: {
                    options: {
                        includePaths: ["absolute/path/a", "absolute/path/b"]
                    }
                }
            })
            .toConfig();
        expect(configuration).toMatchSnapshot();
    });

    it("PostCss config do not exist and warn user", () => {
        const projectLocation = upath.resolve(path, "./postcss-config-not-exist");
        fs.emptyDir(projectLocation);
        const spy = jest.spyOn(global.console, "warn");
        const configuration = new Builder(projectLocation, SAMPLE_CONFIGURATION).use(StylesPlugin).toConfig();
        expect(spy).toHaveBeenCalled();
        expect(configuration).toMatchSnapshot();
    });

    it("PostCss config with an object options", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
            .use(StylesPlugin, {
                postcssLoaderOptions: {
                    options: {
                        sourceMap: "inline"
                    }
                }
            })
            .toConfig();

        expect(configuration).toMatchSnapshot();
    });

    it("PostCss config with a query string options", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
            .use(StylesPlugin, {
                postcssLoaderOptions: {
                    options: "?sourceMap=inline"
                }
            })
            .toConfig();

        expect(configuration).toMatchSnapshot();
    });

    it("PostCss config with a plugin array", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
            .use(StylesPlugin, {
                postcssLoaderOptions: {
                    options: {
                        plugins: [require("autoprefixer")()]
                    }
                }
            })
            .toConfig();

        expect(configuration).toMatchSnapshot();
    });

    it("PostCss config with a plugin function", () => {
        const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
            .use(StylesPlugin, {
                postcssLoaderOptions: {
                    options: {
                        plugins: (options: unknown) => [require("autoprefixer")({ ...options })]
                    }
                }
            })
            .toConfig();

        expect(configuration).toMatchSnapshot();
    });
});
