# @reactway/image-loader

A plugin made for a webpack to load, optimize and resize images.

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

`optimization` - for images optimization it was used [imagemin](https://www.npmjs.com/package/imagemin) package plugins. Here is the list of them:

-   [imagemin-mozjpeg](https://www.npmjs.com/package/imagemin-mozjpeg)
-   [imagemin-optipng](https://www.npmjs.com/package/imagemin-optipng)
-   [imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant)
-   [imagemin-gifsicle](https://www.npmjs.com/package/imagemin-gifsicle)
-   [imagemin-svgo](https://www.npmjs.com/package/imagemin-svgo)
-   [imagemin-webp](https://www.npmjs.com/package/imagemin-webp)

Check links to see possible options you can pass for `optimization` field.

`outputFolder` - path where it will output images. Default path: `assets/images/`

## Documentation

WIP

## Images

All images generated from [placeholder.com](https://placeholder.com/)

## License

Released under the [MIT license](LICENSE).
