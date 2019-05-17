import webpack from "webpack";
import webpackCompiler from "./compiler/compiler";
import ReactwayImagePlugin from "../index";

describe("ReactwayImagePlugin displaying stats", () => {
    it("Adding plugin to config", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader
                    }
                ]
            }
        ];

        const plugins: webpack.Plugin[] = [new ReactwayImagePlugin()];
        const stats = await webpackCompiler("fixture-no-images.js", loader, false, plugins);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });

    it("Adding plugin to config", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader
                    }
                ]
            }
        ];

        const plugins: webpack.Plugin[] = [new ReactwayImagePlugin()];
        const stats = await webpackCompiler("fixture.js", loader, false, plugins);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });
});

describe("ReactwayImagePlugin loader", () => {
    it("Initial loader load", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader
                    }
                ]
            }
        ];
        const stats = await webpackCompiler("fixture.js", loader);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });

    it("Image loader with limit as a number", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader,
                        options: {
                            limit: 10000
                        }
                    }
                ]
            }
        ];
        const stats = await webpackCompiler("fixture.js", loader);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });

    it("Image loader with limit as a number but in string format", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader,
                        options: {
                            limit: "10000"
                        }
                    }
                ]
            }
        ];
        const stats = await webpackCompiler("fixture.js", loader);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });

    it("Image with query", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader
                    }
                ]
            }
        ];
        const stats = await webpackCompiler("fixture.js", loader);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });
    it("Image with not a number query", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader
                    }
                ]
            }
        ];
        const stats = await webpackCompiler("fixture.js", loader);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });

    it("Image with only height query", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader
                    }
                ]
            }
        ];
        const stats = await webpackCompiler("fixture.js", loader);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });

    it("Image with only width query", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader
                    }
                ]
            }
        ];
        const stats = await webpackCompiler("fixture.js", loader);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });
    it("Optimize images in dev", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader,
                        options: {
                            optimizeInDev: true
                        }
                    }
                ]
            }
        ];
        const stats = await webpackCompiler("fixture.js", loader);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });
    it("Setting new output path for image loader", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader,
                        options: {
                            outputFolder: "images/"
                        }
                    }
                ]
            }
        ];
        const stats = await webpackCompiler("fixture.js", loader);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });
    it("Running webpack in production mode", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader
                    }
                ]
            }
        ];
        const stats = await webpackCompiler("fixture.js", loader, true);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });

    it("Optimizing images in production mode", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg|webp)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader,
                        options: {
                            optimization: {
                                mozjpeg: { quality: 75 },
                                gifsicle: { colors: 144 },
                                svgo: {
                                    plugins: [{ removeViewBox: false }]
                                },
                                optipng: { optimizationLevel: 5 },
                                pngquant: {
                                    quality: [0.8, 1]
                                },
                                webp: { quality: 85 }
                            }
                        }
                    }
                ]
            }
        ];
        const stats = await webpackCompiler("fixture.js", loader, true);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });
});
