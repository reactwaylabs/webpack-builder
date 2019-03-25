# @reactway/webpack-builder-plugin-html

A plugin made for webpack-builder.

## Getting started

```sh
$ npm i @reactway/webpack-builder-plugin-html
```

Add plugin into webpack config by using `use()` builder method.

```js
const webpackBuilder = require("@reactway/webpack-builder");
const htmlPlugin = require("@reactway/webpack-builder-plugin-html");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(html)
    .toConfig();
```

## Passing options

Default [webpack-builder-plugin-html](/packages/webpack-builder-plugin-html) options and we are also using base[html-webpack-template](https://www.npmjs.com/package/html-webpack-template) template (`HtmlWebpackTemplate` named value):

```ts
let htmlPluginOptions: HtmlWebpackPlugin.Options | undefined = {
    inject: false,
    template: HtmlWebpackTemplate,
    baseHref: "/",
    appMountIds: ["root"],
    meta: [
        {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
        }
    ]
};
```

By giving any option it will fully override default options. It is wrapped [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin). All options you can pass from the wrapped package.

```js
const webpackBuilder = require("@reactway/webpack-builder");
const htmlPlugin = require("@reactway/webpack-builder-plugin-html");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(html, {
        title: 'Custom template',
        template: 'index.html',
        ...
    }})
    .toConfig();
```

## License

Released under the [MIT license](LICENSE).
