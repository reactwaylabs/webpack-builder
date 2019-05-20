# @reactway/image-loader

A plugin made for a webpack to load, optimize and resize images. `image-loader` used at [webpack-builder-plugin-images](/packages/webpack-builder-plugin-images).

## Getting started

```sh
$ npm i @reactway/image-loader
```

Simple example how to use it:

```js
const ReactwayImagePlugin = require("@reactway/image-loader").ReactwayImagePlugin;

module.exports = {
    entry: "index.js",
    output: {
        path: __dirname + "/dist",
        filename: "main.js"
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: ReactwayImagePlugin.loader,
                options: {
                    optimizeInDev: true,
                    limit: 1000,
                    ...
                }
            }
        ]
    }
    ...
};
```

Adding `@reactway/image-loader` to `plugin` field if you want to see stats of resized/optimized images.

```js
const ReactwayImagePlugin = require("@reactway/image-loader").ReactwayImagePlugin;

module.exports = {
    entry: "index.js",
    output: {
        path: __dirname + "/dist",
        filename: "main.js"
    },
    ...
    plugins: [new ReactwayImagePlugin()],
    ...
};
```

## Passing options

```ts
interface ImageLoaderOptions {
    limit: string | number;
    sourceMap: boolean;
    optimizeInDev: boolean;
    optimization: ImagesOptimization;
    outputFolder: string;
}
```

`limit` - `Number` or number in `string` that specify maximum of file size in bytes. If file size more than `limit` than it will create a file, otherwise - file will be transform into base64 URI.

`sourceMaps` - enable or disable `sourceMaps` for files.

`optimizeInDev` - enable or disable images optimization in `development` environment.

`optimization` - for images optimization it was used [imagemin](https://www.npmjs.com/package/imagemin) package plugins.

-   [imagemin-mozjpeg](https://www.npmjs.com/package/imagemin-mozjpeg)
-   [imagemin-optipng](https://www.npmjs.com/package/imagemin-optipng)
-   [imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant)
-   [imagemin-gifsicle](https://www.npmjs.com/package/imagemin-gifsicle)
-   [imagemin-svgo](https://www.npmjs.com/package/imagemin-svgo)
-   [imagemin-webp](https://www.npmjs.com/package/imagemin-webp)

Check links to see possible options you can pass for `optimization` field.

`outputFolder` - path where it will output images in the given `webpack` config output. Default path: `assets/images/`.

## Documentation

If you want use simple image without resizing:

```js
import sampleImage from "./sample-image.png";
```

For resizing we used [sharp](https://www.npmjs.com/package/sharp) package. Passing `width` or `height` is optional, images scales by given property. If you want resize image with certain `width` or `height` add query at the end of path of file:

```js
const sampleImageSmall = require("./sampleImagejpg.jpg?width=200&height=200");
const sampleImageWidth = require("./sampleImagejpg.jpg?width=200");
const sampleImageHeight = require("./sampleImagejpg.jpg?height=200");
```

At the moment we are not supporting multiple queries. If you want to have separate image sizes, re-import them and add different query.

## Images

All images generated from [placeholder.com](https://placeholder.com/)

## License

Released under the [MIT license](LICENSE).
