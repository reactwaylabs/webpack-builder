import HtmlWebpackPlugin from "html-webpack-plugin";
import HtmlWebpackTemplate from "html-webpack-template";
import { Plugin } from "@reactway/webpack-builder";

interface HtmlPluginOptions {
    options?: HtmlWebpackPlugin.Options;
}

export const HtmlPlugin: Plugin<HtmlPluginOptions> = (config, projectDirectory) => webpack => {
    if (webpack.plugins == null) {
        webpack.plugins = [];
    }

    let htmlPluginOptions: HtmlWebpackPlugin.Options | undefined = {
        inject: false,
        template: HtmlWebpackTemplate,
        baseHref: "/",
        appMountIds: ["root"],
        meta: [
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            }
        ]
    };

    if (config != null) {
        htmlPluginOptions = config.options;
    }

    // ts-jest: Throws error when it cannot resolve project root, because we are using Rush/pnpm.
    // tslint:disable-next-line:no-any
    webpack.plugins.push(new HtmlWebpackPlugin(htmlPluginOptions) as any);
    return webpack;
};
