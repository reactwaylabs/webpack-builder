import { Builder, Configuration } from "@reactway/webpack-builder";
import * as path from "path";
import { ImagesPlugin } from "../plugin";

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

it("Adding image plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(ImagesPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Adding image plugin with imagesOutputLocation option to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(ImagesPlugin, { imagesOutputLocation: "./" })
        .toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Adding image plugin with publicPath option to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(ImagesPlugin, { publicPath: "./" })
        .toConfig();
    expect(configuration).toMatchSnapshot();
});
