import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { Plugin, Configuration } from "@reactway/webpack-builder";
import { Options } from "./plugin-options";

export interface CleanPluginOptions extends Partial<Options> {}

export const CleanPlugin: Plugin<CleanPluginOptions> = (config: CleanPluginOptions, projectDirectory: string) => (
    webpack: Configuration
) => {
    if (webpack.plugins == null) {
        webpack.plugins = [];
    }

    let cleanPluginConfig: Partial<Options> = {};
    if (config != null) {
        cleanPluginConfig = config;
    }

    webpack.plugins.push(new CleanWebpackPlugin({ ...cleanPluginConfig }));
    return webpack;
};
