# @reactway/webpack-builder-plugin-images

A plugin made for webpack-builder.

## Getting started

```sh
$ npm i @reactway/webpack-builder-plugin-images
```

Add plugin into webpack config by using `use()` builder method.

```js
const webpackBuilder = require("@reactway/webpack-builder");
const images = require("@reactway/webpack-builder-plugin-images");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(images)
    .toConfig();
```

## Passing options

Options you can pass:

```ts
interface ImageLoaderOptions {
    limit: string | number;
    sourceMap: boolean;
    optimizeInDev: boolean;
    optimization: ImagesOptimization;
    outputFolder: string;
}
```

More details about `@reactway/image-loader` options you can read [@reactway/image-loader options](https://github.com/reactway/webpack-builder/tree/feature/refactoring-image-plugin/packages/webpack-builder-plugin-image-loader#passing-options).

```js
const webpackBuilder = require("@reactway/webpack-builder");
const images = require("@reactway/webpack-builder-plugin-images");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(images, {
        limit:1000
        ...
    })
    .toConfig();
```

## Documentation

WIP

## License

Released under the [MIT license](LICENSE).
