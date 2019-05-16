import upath from "upath";
import webpack from "webpack";
import memoryfs from "memory-fs";

export default (fixture: string, webpackModule: webpack.RuleSetRule[], options = {}): Promise<webpack.Stats> => {
    const compiler = webpack({
        mode: "development",
        context: __dirname,
        entry: `./${fixture}`,
        output: {
            path: upath.resolve(__dirname),
            filename: "bundle.js"
        },
        module: {
            rules: [...webpackModule]
        }
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
