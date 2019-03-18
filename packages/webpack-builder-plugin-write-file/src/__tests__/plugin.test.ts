__dirname = "TEST_PATH";

jest.mock("upath", () => ({
    ...jest.requireActual("upath"),
    resolve: (...pathSegments: string[]) => pathSegments.join("//"),
    join: (...pathSegments: string[]) => pathSegments.join("//")
}));

import { Builder, Configuration } from "@reactway/webpack-builder";
import upath from "upath";
import { WriteFilePlugin } from "../plugin";

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

it("Adding write file plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(WriteFilePlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Adding write file plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(WriteFilePlugin, {
            // Write only files that have ".css" extension.
            test: /\.css$/,
            useHashIndex: true
        })
        .toConfig();
    expect(configuration).toMatchSnapshot();
});
