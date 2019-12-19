import upath from "upath";
import WebpackDevServer from "webpack-dev-server";

import { Plugin, Configuration } from "@reactway/webpack-builder";

const HOST: string = "0.0.0.0";
const DEFAULT_PORT: number = 3000;
const DEFAULT_OUTPUT_LOCATION: string = "./dist";

// tslint:disable-next-line:no-empty-interface
export interface WebDevServerOptions extends WebpackDevServer.Configuration {}

export const WebDevPlugin: Plugin<WebDevServerOptions> = (config: WebDevServerOptions, projectDirectory: string) => (
    _webpack: Configuration
) => {
    const webpackWithDevServer: Configuration & { devServer?: WebpackDevServer.Configuration } = _webpack;
    if (webpackWithDevServer.devServer == null) {
        webpackWithDevServer.devServer = {};
    }

    let webDevServer: WebpackDevServer.Configuration | undefined = {
        compress: true,
        host: HOST,
        quiet: false,
        port: DEFAULT_PORT,
        historyApiFallback: true,
        // Seems no more warning of deprecation. Remove when it appears again.
        contentBase: upath.resolve(projectDirectory, DEFAULT_OUTPUT_LOCATION)
    };

    if (config != null) {
        webDevServer = config;
    }

    webpackWithDevServer.devServer = webDevServer;

    return webpackWithDevServer;
};
