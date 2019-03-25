# @reactway/webpack-builder-plugin-typescript

A plugin made for webpack-builder.

## Getting started

```sh
$ npm i @reactway/webpack-builder-plugin-typescript
```

Add plugin into webpack config by using `use()` builder method.

```js
const webpackBuilder = require("@reactway/webpack-builder");
const typeScript = require("@reactway/webpack-builder-plugin-typescript");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(typeScript.TypeScriptPlugin)
    .toConfig();
```

Works well with `react typescript` version. If you are planning to use `json` be sure add

```json
"linterOptions": {
    "exclude": [
      "*.json",
      "**/*.json"
    ]
  }
```

at `tslint.json` file.

## Passing options

It have wrapped [fork-ts-checker-webpack-plugin](https://www.npmjs.com/package/fork-ts-checker-webpack-plugin) and [tsconfig-paths-webpack-plugin](https://www.npmjs.com/package/tsconfig-paths-webpack-plugin). You can pass both plugin options separate.

```js
const webpackBuilder = require("@reactway/webpack-builder");
const typeScript = require("@reactway/webpack-builder-plugin-typescript");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(typeScript.TypeScriptPlugin, {
        forkTsCheckerOptions: {
            formatter: "codeframe",
            silent: true,
            ...
        },
        ...
    })
    .toConfig();
```

## Documentation

WIP

## License

Released under the [MIT license](LICENSE).
