import { ReactwayImageLoaderPlugin } from "@reactway/image-loader";
__dirname = "TEST_PATH";
ReactwayImageLoaderPlugin.loader = "./path/to/link";

jest.mock("upath", () => ({
    ...jest.requireActual("upath"),
    resolve: (...pathSegments: string[]) => pathSegments.join("//"),
    join: (...pathSegments: string[]) => pathSegments.join("//")
}));

jest.mock("@reactway/image-loader");

import { Builder, Configuration } from "@reactway/webpack-builder";
import upath from "upath";
import { ImagesPlugin } from "../plugin";

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

it("Adding image plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(ImagesPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Adding image plugin with loader options to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(ImagesPlugin, {
            imageSizeLimitInBytes: 10000
        })
        .toConfig();
    expect(configuration).toMatchSnapshot();
});
