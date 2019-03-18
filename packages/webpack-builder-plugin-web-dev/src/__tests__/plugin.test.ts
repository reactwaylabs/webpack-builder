import { Builder, Configuration } from "@reactway/webpack-builder";
import upath from "upath";
import { WebDevPlugin } from "../plugin";

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

it("Adding web dev plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(WebDevPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Adding web dev plugin with options to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(WebDevPlugin, {
            devServer: {
                compress: false
            }
        })
        .toConfig();

    expect(configuration).toMatchSnapshot();
});
