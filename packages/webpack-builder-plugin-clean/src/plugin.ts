import CleanWebpackPlugin from "clean-webpack-plugin";
import { Plugin } from "@reactway/webpack-builder";
import { Options } from "./plugin-options";

interface CleanPluginOptions {
    options?: Partial<Options>;
}

export const CleanPlugin: Plugin<CleanPluginOptions> = (config, projectDirectory) => webpack => {
    if (webpack.plugins == null) {
        webpack.plugins = [];
    }

    let cleanPluginConfig: Partial<Options> = {};
    if (config != null && config.options != null) {
        cleanPluginConfig = config.options;
    }

    webpack.plugins.push(new CleanWebpackPlugin({ ...cleanPluginConfig }));
    return webpack;
};
