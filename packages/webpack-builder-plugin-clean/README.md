# @reactway/webpack-builder-plugin-clean

A plugin made for webpack-builder.

## Getting started

```sh
$ npm i @reactway/webpack-builder-plugin-clean
```

Add plugin into webpack config by using `use()` builder method.

```js
const webpackBuilder = require("@reactway/webpack-builder");
const clean = require("@reactway/webpack-builder-plugin-clean");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(clean)
    .toConfig();
```

## Passing options

It is wrapped [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin). All options you can pass from the wrapped package. Available options you can check at [clean-webpack-plugin-options](https://www.npmjs.com/package/clean-webpack-plugin#options-and-defaults-optional)

```js
const webpackBuilder = require("@reactway/webpack-builder");
const clean = require("@reactway/webpack-builder-plugin-clean");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(clean, {
        dry: true,
        cleanStaleWebpackAssets: false,
        ...
    })
    .toConfig();
```

## License

Released under the [MIT license](LICENSE).
