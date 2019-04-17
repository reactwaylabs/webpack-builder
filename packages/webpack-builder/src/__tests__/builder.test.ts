__dirname = "TEST_PATH";

jest.mock("upath", () => ({
    ...jest.requireActual("upath"),
    resolve: (...pathSegments: string[]) => pathSegments.join("//"),
    join: (...pathSegments: string[]) => pathSegments.join("//")
}));

import { Configuration } from "webpack";
import upath from "upath";
// Config builder
import { Builder } from "../builder";
// Sample plugin
import { SamplePlugin } from "./sample-plugin/sample-plugin";

let SAMPLE_CONFIGURATION: Configuration = {};
const TEST_PROJECT_LOCATION: string = upath.resolve(__dirname, "./test-project");

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

it("Simple configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Simple configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(SamplePlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("No configuration given", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION)
        .update(webpack => {
            webpack.entry = SAMPLE_CONFIGURATION.entry;
            webpack.output = SAMPLE_CONFIGURATION.output;
            return webpack;
        })
        .toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Update simple configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .update(webpack => {
            webpack.mode = "production";
            return webpack;
        })
        .toConfig();

    expect(configuration).toMatchSnapshot();
});

it("No entry file given to configuration", () => {
    const noEntryFileDefined = Object.assign({}, SAMPLE_CONFIGURATION);
    noEntryFileDefined.entry = undefined;
    const configuration = new Builder(TEST_PROJECT_LOCATION, noEntryFileDefined);

    expect(() => configuration.toConfig()).toThrowError("[Webpack Builder] Entry file is not defined.");
});

it("No configuration output given", () => {
    const noOutputDefined = Object.assign({}, SAMPLE_CONFIGURATION);
    noOutputDefined.output = undefined;
    const configuration = new Builder(TEST_PROJECT_LOCATION, noOutputDefined);

    expect(() => configuration.toConfig()).toThrowError("[Webpack Builder] Output directory is not defined.");
});

it("Configuration type node", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .update(webpack => {
            webpack.target = "node";
            return webpack;
        })
        .toConfig();

    expect(configuration).toMatchSnapshot();
});

it("Simple configuration with optimization", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).toConfig(true);
    expect(configuration).toMatchSnapshot();
});
