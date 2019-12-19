import { Plugin, Configuration } from "@reactway/webpack-builder";
import { ReactwayImageLoaderPlugin, ImageLoaderOptions } from "@reactway/image-loader";

export interface ImagesPluginOptions extends Partial<ImageLoaderOptions> {}

export const ImagesPlugin: Plugin<ImagesPluginOptions> = (config: ImagesPluginOptions, projectDirectory: string) => (
    webpack: Configuration
) => {
    if (webpack.module == null) {
        webpack.module = {
            rules: []
        };
    }

    webpack.module.rules.push({
        test: /\.(png|jpg|gif|svg)$/,
        loader: ReactwayImageLoaderPlugin.loader,
        options: {
            ...config
        }
    });
    return webpack;
};
