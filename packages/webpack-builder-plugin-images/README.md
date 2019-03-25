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
interface ImagesPluginOptions {
    imagesOutputLocation?: string;
    publicPath?: string;
    urlLoaderOptions?: { [key: string]: any };
}
```

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
        publicPath: "./",
        ...
    })
    .toConfig();
```

## License

Released under the [MIT license](LICENSE).
