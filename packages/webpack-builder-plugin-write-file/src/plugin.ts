import WriteFileWebpackPlugin from "write-file-webpack-plugin";
import { Plugin } from "@reactway/webpack-builder";

export interface WriteFilePluginOptions {
    // tslint:disable-next-line no-any
    [key: string]: any;
}

export const WriteFilePlugin: Plugin<WriteFilePluginOptions> = (
    config: WriteFilePluginOptions | undefined,
    projectDirectory
) => webpack => {
    if (webpack.plugins == null) {
        webpack.plugins = [];
    }
    webpack.plugins.push(new WriteFileWebpackPlugin(config));
    return webpack;
};
