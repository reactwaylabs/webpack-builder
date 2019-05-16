import webpack from "webpack";
import webpackCompiler from "./compiler/compiler";
import ReactwayImagePlugin from "../index";

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

    it("Image loader with limit for base64 with current images", async () => {
        const loader: webpack.RuleSetRule[] = [
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: ReactwayImagePlugin.loader,
                        options: {
                            limit: 0.001
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
                            // output: "images/[fileOriginalHash].[query].[name].[ext]",
                            // optimization: {
                            //     mozjpeg: { quality: 75 },
                            //     gifsicle: { colors: 144 },
                            //     svgo: {
                            //         plugins: [{ removeViewBox: false }]
                            //     },
                            //     pngquant: {
                            //         quality: [0.8, 1]
                            //     }
                            // }
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
                            output: "images/[fileOriginalHash].[name].[ext]"
                            // optimization: {
                            //     mozjpeg: { quality: 75 },
                            //     gifsicle: { colors: 144 },
                            //     svgo: {
                            //         plugins: [{ removeViewBox: false }]
                            //     },
                            //     pngquant: {
                            //         quality: [0.8, 1]
                            //     }
                            // }
                        }
                    }
                ]
            }
        ];
        const stats = await webpackCompiler("fixture.js", loader);
        const [{ source }] = stats.toJson().modules;

        expect(source).toMatchSnapshot();
    });
    // fit("test", async () => {
    //     const loader: webpack.RuleSetRule[] = [
    //         {
    //             test: /\.(png|jpg|gif|svg)$/,
    //             use: [
    //                 {
    //                     loader: ReactwayImagePlugin.loader
    //                 }
    //             ]
    //         }
    //     ];
    //     // const stats = ;
    //     // const [{ source }] = stats.toJson().modules;

    //     // expect(source).toMatchSnapshot();
    //     expect(() => webpackCompiler("fixture.js", loader)).toThrowError();
    // });
});
