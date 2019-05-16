import { Plugin as WebpackPlugin, Compiler } from "webpack";
import chalk from "chalk";
import { ImageSizeData } from "./contracts";

export class ReactwayImagePlugin implements WebpackPlugin {
    public static loader: string;
    public static imagesSizeArray: ImageSizeData[] = [];

    public apply(compiler: Compiler): void {
        // Chalk.
        const green = chalk.green;
        const white = chalk.white;
        const yellow = chalk.yellow;
        const blueBright = chalk.blueBright;

        compiler.hooks.done.tap("reactway-image-plugin", () => {
            const imagesSizeData = ReactwayImagePlugin.imagesSizeArray;

            if (imagesSizeData.length === 0) {
                console.warn("No files found to compare.");
                return;
            }

            console.info();
            console.info(green("RWIP | Images stats:".toLocaleUpperCase()));
            console.info(green("-".repeat(50)));

            imagesSizeData.forEach(image => {
                console.info();
                console.info(`Raw image request: ${yellow(`${image.rawRequest}`)}`);
                console.info(`Image file path: ${yellow(`${image.filePath}`)}`);
                console.info(`Requested source file path: ${yellow(`${image.requestedFilePath}`)}`);
                if (image.isBase64 === true) {
                    console.info(blueBright("Image converted to Base64."));
                    return;
                }

                if (image.reducedSize == null || image.originalSize.length === image.reducedSize.length) {
                    console.info(blueBright("Reduced image size haven't changed compare to original image size."));
                    return;
                }

                const originalSize = white(`${image.originalSize.length}`);
                const reducedSize = white(`${image.reducedSize.length}`);

                // Image size compared to original in percentages.
                const reducedImagePercentage: number = 100 - (image.reducedSize.length * 100) / image.originalSize.length;
                const displayPercentage =
                    reducedImagePercentage > 0
                        ? chalk.greenBright(`${reducedImagePercentage.toFixed(2)}%`)
                        : chalk.redBright(`${reducedImagePercentage.toFixed(2)}%`);

                console.info(
                    blueBright(
                        // tslint:disable-next-line:max-line-length
                        `Compared original image size(${originalSize}) with optimized/resized size(${reducedSize}) reduced by ${displayPercentage}`
                    )
                );
            });
            console.info(green("-".repeat(50)));
            console.info();
        });
    }
}

ReactwayImagePlugin.loader = require.resolve("./image-loader");
