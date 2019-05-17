import { Plugin as WebpackPlugin, Compiler } from "webpack";
import debug from "debug";
import chalk from "chalk";
import { ImageSizeData } from "./contracts";

const log = debug("rw-image-plugin");

log.enabled = true;

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
                return;
            }

            log("");
            log(green("RWIP | Images stats:".toLocaleUpperCase()));
            log(green("-".repeat(50)));

            imagesSizeData.forEach(image => {
                log("=".repeat(10));
                log(`| Raw image request: ${yellow(`${image.rawRequest}`)}`);
                log(`| Image file path: ${yellow(`${image.filePath}`)}`);
                log(`| Requested source file path: ${yellow(`${image.requestedFilePath}`)}`);
                if (image.isBase64 === true) {
                    log(blueBright("|Image converted to Base64."));
                    return;
                }

                if (image.reducedSize == null || image.originalSize.length === image.reducedSize.length) {
                    log(blueBright("| Reduced image size haven't changed compare to original image size."));
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

                log(
                    blueBright(
                        // tslint:disable-next-line:max-line-length
                        `| Compared original image size(${originalSize}) with optimized/resized size(${reducedSize}) reduced by ${displayPercentage}`
                    )
                );
            });
            log("=".repeat(10));
            log(green("-".repeat(50)));
            log("");
        });
    }
}

ReactwayImagePlugin.loader = require.resolve("./image-loader");
