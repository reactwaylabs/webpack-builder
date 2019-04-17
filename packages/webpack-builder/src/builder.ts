import { Configuration as WebpackConfiguration } from "webpack";

export type Configuration = WebpackConfiguration;
export type UpdateHandler = (webpack: Configuration) => Configuration;
// tslint:disable-next-line no-any
export type Plugin<TConfig = any> = (config: TConfig | undefined, projectDirectory: string) => UpdateHandler;

export class Builder {
    constructor(protected readonly projectDirectory: string, private configuration: Configuration = {}) {}

    public use<TPlugin extends Plugin>(plugin: TPlugin, config?: Parameters<TPlugin>[0]): this {
        this.configuration = plugin(config, this.projectDirectory)(this.configuration);

        return this;
    }

    public update(callback: UpdateHandler): this {
        this.configuration = callback(this.configuration);

        return this;
    }

    public toConfig(enableOptimization?: boolean): Configuration {
        if (this.configuration.entry == null) {
            throw new Error("[Webpack Builder] Entry file is not defined.");
        }

        if (this.configuration.output == null) {
            throw new Error("[Webpack Builder] Output directory is not defined.");
        }

        if (this.configuration.target !== "node" && this.configuration.node == null) {
            this.configuration.node = {
                fs: "empty",
                net: "empty",
                tls: "empty"
            };
        }

        if (enableOptimization === true) {
            this.configuration.optimization = {
                splitChunks: {
                    cacheGroups: {
                        vendors: {
                            test: /[\\/]node_modules[\\/]/,
                            name: "vendor",
                            chunks: "all"
                        }
                    }
                },
                ...this.configuration.optimization
            };
        }

        return this.configuration;
    }
}
