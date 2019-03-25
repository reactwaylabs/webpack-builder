# @reactway/webpack-builder-plugin-write-file

A plugin made for webpack-builder.

## Getting started

```sh
$ npm i @reactway/webpack-builder-plugin-write-file
```

Add plugin into webpack config by using `use()` builder method.

```js
const webpackBuilder = require("@reactway/webpack-builder");
const writeFile = require("@reactway/webpack-builder-plugin-write-file");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(writeFile)
    .toConfig();
```

## Passing options

It is wrapped [write-file-webpack-plugin](https://www.npmjs.com/package/write-file-webpack-plugin). All options you can pass from the wrapped package. Available options you can check at [write-file-webpack-plugin-options](https://www.npmjs.com/package/write-file-webpack-plugin#api)

```ts
interface WriteFilePluginOptions {
    [key: string]: any;
}
```

```js
const webpackBuilder = require("@reactway/webpack-builder");
const writeFile = require("@reactway/webpack-builder-plugin-write-file");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(writeFile, {
        test: /\.css$/,
        useHashIndex: true
    })
    .toConfig();
```

## License

Released under the [MIT license](LICENSE).
