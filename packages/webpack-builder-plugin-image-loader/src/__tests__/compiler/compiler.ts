/**
 * Base testing case took from https://webpack.js.org/contribute/writing-a-loader/#testing 
 * and updated by certain loader.
 */

import upath from "upath";
import webpack from "webpack";
import memoryfs from "memory-fs";

const fullOutputPath = upath.resolve(__dirname, "../dist");

export default (
    fixture: string,
    webpackModule: webpack.RuleSetRule[],
    isProd?: boolean,
    plugins?: webpack.Plugin[]
): Promise<webpack.Stats> => {
    const mode = isProd === true ? "production" : "development";
    const compiler = webpack({
        mode: mode,
        context: __dirname,
        entry: `./${fixture}`,
        output: {
            path: fullOutputPath,
            filename: "bundle.js"
        },
        module: {
            rules: [...webpackModule]
        },
        plugins: plugins
    });

    compiler.outputFileSystem = new memoryfs();

    return new Promise((resolve, reject) => {
        compiler.run((err: Error, stats: webpack.Stats) => {
            if (err) reject(err);
            if (stats.hasErrors()) reject(new Error(JSON.stringify(stats.toJson().errors)));

            resolve(stats);
        });
    });
};
