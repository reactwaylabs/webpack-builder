# @reactway/webpack-builder
A tool to create webpack config easier using plugins

## Getting started

```sh
$ npm i @reactway/webpack-builder
```



Create file `webpack.config.json` with content
```js
const webpackBuilder = require("@reactway/webpack-builder");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.js",
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    }
})
```



## License
Released under the [MIT license](LICENSE).
