# @reactway/webpack-builder-plugin-styles

A plugin made for webpack-builder.

## Getting started

```sh
$ npm i @reactway/webpack-builder-plugin-styles
```

Add plugin into webpack config by using `use()` builder method.

```js
const webpackBuilder = require("@reactway/webpack-builder");
const styles = require("@reactway/webpack-builder-plugin-styles");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(styles.StylesPlugin)
    .toConfig();
```

## Passing options

By giving any option it will fully override that default options. All loaders have `LoaderOptions` type that are `Webpack.RuleSetLoader` without `loader` field. At the moment only `url-loader`, field `options` have default options.

```ts
const baseUrlLoaderOptions = {
    name: `${fontsOutputLocation}/[name].[ext]`,
    publicPath: fontsPublicPath,
    limit: 10000
};
```

`fontsOutputLocation` and `fontsPublicPath` can be passed through by options. If it is not given then it will have default values:

```ts
const fontsOutputLocation: string = "./assets/fonts";
const fontsPublicPathF: string = "./";
```

And base use case.

```js
const webpackBuilder = require("@reactway/webpack-builder");
const styles = require("@reactway/webpack-builder-plugin-styles");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(StylesPlugin, {
        sassLoaderOptions: {
            options: {
                includePaths: ["absolute/path/a", "absolute/path/b"]
            }
        },
        ...
    })
    .toConfig();
```

## Documentation

WIP

## License

Released under the [MIT license](LICENSE).
