import { Builder, Configuration } from "@reactway/webpack-builder";
import * as path from "path";
import * as fs from "fs-extra";
import { StylesPlugin } from "../plugin";

let SAMPLE_CONFIGURATION: Configuration = {};
const TEST_PROJECT_LOCATION: string = path.resolve(__dirname, "./test-project");

beforeEach(() => {
    SAMPLE_CONFIGURATION = {
        entry: "./src/index.ts",
        mode: "development",
        output: {
            path: path.resolve(TEST_PROJECT_LOCATION, "dist"),
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

it("PostCss config do not exist", () => {
    const projectLocation = path.resolve(__dirname, "./postcss-config-not-exist");
    fs.emptyDir(projectLocation);
    const configuration = new Builder(projectLocation, SAMPLE_CONFIGURATION).use(StylesPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});
