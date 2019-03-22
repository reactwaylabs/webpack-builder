# @reactway/webpack-builder

A tool to create webpack config easier using @reactway plugins.

## Getting started

```sh
$ npm i @reactway/webpack-builder
```

To create a webpack config with builder first you have to create `webpack.congif.js` and add import to it. You must define **workspace directory** and base configuration with **`entry`** and **`output`** fields to able use.

## Example

```js
const webpackBuilder = require("@reactway/webpack-builder");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
}).toConfig();
```

## API

`use()` - Insert plugin to config.

### Example

```js
const webpackBuilder = require("@reactway/webpack-builder");
const examplePlugin = require("@reactway/webpack-builder-example-plugin");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .use(examplePlugin)
    .toConfig();
```

---

`update()` - Update webpack config fields.

### Example

```js
const webpackBuilder = require("@reactway/webpack-builder");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
    .update(webpack => {
        webpack.mode = "production";
        return webpack;
    })
    .toConfig();
```

---

`toConfig()` - Returns `webpack` config to use. **Required to generate configuration.**

## License

---

Released under the [MIT license](LICENSE).
