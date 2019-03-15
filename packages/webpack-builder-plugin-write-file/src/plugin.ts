import WriteFileWebpackPlugin from "write-file-webpack-plugin";
import { Plugin } from "@reactway/webpack-builder";

interface WriteFilePluginOptions {
    [key: string]: any;
}

export const WriteFilePlugin: Plugin<WriteFilePluginOptions> = (config, projectDirectory) => webpack => {
    if (webpack.plugins == null) {
        webpack.plugins = [];
    }
    webpack.plugins.push(new WriteFileWebpackPlugin(config));
    return webpack;
};
