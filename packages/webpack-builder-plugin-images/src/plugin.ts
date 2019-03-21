import { Plugin } from "@reactway/webpack-builder";

const IMAGES_OUTPUT_LOCATION: string = "./assets/images";
const PUBLIC_PATH: string = "/";
// tslint:disable-next-line no-any
type OptionsDictionary = { [key: string]: any };

interface ImagesPluginOptions {
    imagesOutputLocation?: string;
    publicPath?: string;
    urlLoaderOptions?: OptionsDictionary;
}

export const ImagesPlugin: Plugin<ImagesPluginOptions> = (config, projectDirectory) => webpack => {
    if (webpack.module == null) {
        webpack.module = {
            rules: []
        };
    }

    const imagesOutputLocation: string =
        config != null && config.imagesOutputLocation != null ? config.imagesOutputLocation : IMAGES_OUTPUT_LOCATION;

    const publicPath: string = config != null && config.publicPath != null ? config.publicPath : PUBLIC_PATH;

    let urlLoaderOptions: OptionsDictionary = {};
    if (config != null && config.urlLoaderOptions != null) {
        urlLoaderOptions = config.urlLoaderOptions;
    }

    webpack.module.rules.push({
        test: /\.(png|jpg|gif|svg)$/,
        options: {
            name: `${imagesOutputLocation}/[name].[ext]`,
            publicPath: publicPath,
            limit: 10000,
            ...urlLoaderOptions
        },
        loader: "url-loader"
    });
    return webpack;
};
