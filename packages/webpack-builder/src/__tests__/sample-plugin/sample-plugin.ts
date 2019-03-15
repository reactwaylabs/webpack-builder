import { Plugin } from "../../builder";

export const SamplePlugin: Plugin = (config, projectDirectory) => webpack => {
    if (webpack.module == null) {
        webpack.module = {
            rules: []
        };
    }

    webpack.module.rules.push({
        test: /\.json$/,
        type: "javascript/auto",
        loader: "custom-json-loader"
    });

    return webpack;
};
