import { Plugin } from "@reactway/webpack-builder";
import { ReactwayImageLoaderPlugin, ImageLoaderOptions } from "@reactway/image-loader";

interface ImagesPluginOptions extends Partial<ImageLoaderOptions> {}

export const ImagesPlugin: Plugin<ImagesPluginOptions> = (config, projectDirectory) => webpack => {
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
