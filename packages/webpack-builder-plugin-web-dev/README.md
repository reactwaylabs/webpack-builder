# @reactway/webpack-builder-plugin-web-dev

A plugin made for webpack-builder. Plugin that provides a development server that gives live reloading and should be used **only** for **development**.

## Getting started

```sh
$ npm i @reactway/webpack-builder-plugin-web-dev
```

Add plugin into webpack config by using `use()` builder method.

```js
const webpackBuilder = require("@reactway/webpack-builder");
const webpackDevServer = require("@reactway/webpack-builder-plugin-web-dev");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(webpackDevServer)
    .toConfig();
```

## Passing options

By giving any option it will fully override default options.

```ts
let webDevServer: WebpackDevServer.Configuration | undefined = {
    contentBase: "./dist",
    compress: true,
    host: "0.0.0.0",
    quiet: false,
    port: 3000,
    historyApiFallback: true
};
```

It is wrapped [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server). All options you can pass from the wrapped package. Available options you can check at [webpack-dev-server-options](https://webpack.js.org/configuration/dev-server/#devserver).

```js
const webpackBuilder = require("@reactway/webpack-builder");
const webpackDevServer = require("@reactway/webpack-builder-plugin-web-dev");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(webpackDevServer, {
        port: 3001,
        quiet: true,
        ...
    })
    .toConfig();
```

Suggest using `@reactway/webpack-builder-plugin-web-dev` together with `@reactway/webpack-builder-plugin-html`.

## License

Released under the [MIT license](LICENSE).
