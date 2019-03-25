import upath from "upath";
import WebpackDevServer from "webpack-dev-server";

import { Plugin, Configuration } from "@reactway/webpack-builder";

const HOST: string = "0.0.0.0";
const DEFAULT_PORT: number = 3000;
const DEFAULT_OUTPUT_LOCATION: string = "./dist";

// tslint:disable-next-line:no-empty-interface
interface WebDevServerOptions extends WebpackDevServer.Configuration {}

export const WebDevPlugin: Plugin<WebDevServerOptions> = (config, projectDirectory) => _webpack => {
    const webpackWithDevServer: Configuration & { devServer?: WebpackDevServer.Configuration } = _webpack;
    if (webpackWithDevServer.devServer == null) {
        webpackWithDevServer.devServer = {};
    }

    let webDevServer: WebpackDevServer.Configuration | undefined = {
        contentBase: upath.resolve(projectDirectory, DEFAULT_OUTPUT_LOCATION),
        compress: true,
        host: HOST,
        quiet: false,
        port: DEFAULT_PORT,
        historyApiFallback: true
    };

    if (config != null) {
        webDevServer = config;
    }

    webpackWithDevServer.devServer = webDevServer;

    return webpackWithDevServer;
};
