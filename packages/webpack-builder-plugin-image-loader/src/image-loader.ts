import { loader } from "webpack";
import fs from "fs-extra";
// Utils
import { getOptions, interpolateName, parseQuery, OptionObject, getHashDigest } from "loader-utils";
import validateOptions from "schema-utils";
// Loader schema.
import imageLoaderSchema from "./image-loader-schema.json";
// imagemin
import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminOptipng from "imagemin-optipng";
import imageminPngquant from "imagemin-pngquant";
import imageminGifsicle from "imagemin-gifsicle";
import imageminSvgo from "imagemin-svgo";
import imageminWebp from "imagemin-webp";
// mime
import mime from "mime";
// Sharp
import sharp from "sharp";
// Local imports
import { ReactwayImageLoaderPlugin } from "./plugin";
import { ImageSizeData, ImageLoaderOptions, FileNameQuery } from "./contracts";

class ImageLoader {
    protected static generateFileNameQuery(parsedResourceQuery: OptionObject | null): FileNameQuery | null {
        let queryParam: string = "";
        if (parsedResourceQuery != null) {
            const widthKey = Object.keys(parsedResourceQuery).find(key => key === "width");
            const heightKey = Object.keys(parsedResourceQuery).find(key => key === "height");
            let widthValue = undefined;
            let heightValue = undefined;

            if (widthKey != null) {
                const queryKeyValue = parsedResourceQuery[widthKey];
                if (Number(queryKeyValue)) {
                    widthValue = Number(queryKeyValue);
                    queryParam += `-${widthValue}w`;
                }
            }

            if (heightKey != null) {
                const queryKeyValue = parsedResourceQuery[heightKey];
                if (Number(queryKeyValue)) {
                    heightValue = Number(queryKeyValue);
                    queryParam += `-${heightValue}h`;
                }
            }

            return {
                textQuery: queryParam,
                width: widthValue,
                height: heightValue
            };
        }
        return null;
    }

    protected static async optimizeImage(
        this: loader.LoaderContext,
        options: Partial<ImageLoaderOptions>,
        content: Buffer,
        url: string,
        imageSizeData: ImageSizeData
    ): Promise<void> {
        const plugins: imagemin.Plugin[] = [];

        if (options.optimization == null) {
            return;
        }

        if (options.optimization.mozjpeg != null) {
            plugins.push(imageminMozjpeg(options.optimization.mozjpeg));
        }

        if (options.optimization.gifsicle != null) {
            plugins.push(imageminGifsicle(options.optimization.gifsicle));
        }

        if (options.optimization.optipng != null) {
            plugins.push(imageminOptipng(options.optimization.optipng));
        }

        if (options.optimization.pngquant != null) {
            plugins.push(imageminPngquant(options.optimization.pngquant));
        }

        if (options.optimization.svgo != null) {
            plugins.push(imageminSvgo(options.optimization.svgo));
        }

        if (options.optimization.webp != null) {
            plugins.push(imageminWebp(options.optimization.webp));
        }

        try {
            const newContent = await imagemin.buffer(content, { plugins: plugins });
            // Outputting file to 'url' location.
            this.emitFile(`${url}`, newContent, options.sourceMap);

            ReactwayImageLoaderPlugin.imagesSizeArray.push({
                ...imageSizeData,
                reducedSize: newContent
            });
        } catch (error) {
            console.error(error);
        }
    }

    protected static moduleExportImageBase64(
        limit: string | number | undefined,
        resourcePath: string,
        content: Buffer,
        imageSizeData: ImageSizeData
    ): string | undefined {
        if (limit == null) {
            return undefined;
        }

        const mimeType = mime.getType(resourcePath);

        if (typeof limit === "string") {
            limit = Number(limit);
        }

        if (content.length > limit) {
            return undefined;
        }

        ReactwayImageLoaderPlugin.imagesSizeArray.push({ ...imageSizeData, isBase64: true });

        return `module.exports = ${JSON.stringify(`data:${mimeType || ""};base64,${content.toString("base64")}`)}`;
    }

    public static async load(this: loader.LoaderContext, contentBuffer: string | Buffer): Promise<string> {
        if (typeof contentBuffer === "string") {
            throw new Error(
                // tslint:disable-next-line:max-line-length
                `Loader got a string instead of a Buffer, even though a static property 'raw' is set to true. This should never have happened.`
            );
        }

        if (this._compiler.options.output == null) {
            throw new Error(`output property is missing in Webpack configuration.`);
        }

        if (this._compiler.options.output.path == null) {
            throw new Error(`output.path value is missing in Webpack configuration.`);
        }

        // Loader options.
        const options = (getOptions(this) as Partial<ImageLoaderOptions>) || {};
        // Validating loader options.
        validateOptions(imageLoaderSchema, options, "Image Loader");
        // Base information of image saving to use for exporting stats.
        const imageSizeData: ImageSizeData = {
            filePath: this.resourcePath,
            rawRequest: this._module.rawRequest,
            requestedFilePath: this._module.issuer.resource,
            originalSize: contentBuffer
        };

        const imageBase64 = ImageLoader.moduleExportImageBase64(options.limit, this.resourcePath, contentBuffer, imageSizeData);
        if (imageBase64 != null) {
            return imageBase64;
        }

        // Creates hash using file content (buffer).
        const fileOriginalHash = getHashDigest(contentBuffer, "md5", "hex", 16);

        // Resizing images.
        const parsedResourceQuery = this.resourceQuery ? parseQuery(this.resourceQuery) : null;
        const query = ImageLoader.generateFileNameQuery(parsedResourceQuery);

        const defaultOutputFileFormat = `${fileOriginalHash}-[name]${query == null ? "" : `${query.textQuery}`}.[ext]`;
        const defaultOutput: string = `assets/images/${defaultOutputFileFormat}`;

        let output = defaultOutput;
        if (options.outputFolder != null) {
            output = options.outputFolder.endsWith("/")
                ? `${options.outputFolder}${defaultOutputFileFormat}`
                : `${options.outputFolder}/${defaultOutputFileFormat}`;
        }

        // With interpolate you need to add a folder path to export properly.
        const url = interpolateName(this, output, {
            context: this.rootContext,
            content: contentBuffer
        });
        const path = `__webpack_public_path__ + ${JSON.stringify(url)}`;

        // If 'optimizeInDev' value set to 'true' then every build check if files(images) exists in output dir is skipped.
        if (!options.optimizeInDev) {
            const replacedOutputPath: string = this._compiler.options.output.path.replace(/\\/g, "/");
            const existentFilePath = `${replacedOutputPath}/${url}`;
            if (fs.existsSync(existentFilePath)) {
                const fileContent = fs.readFileSync(existentFilePath);
                ReactwayImageLoaderPlugin.imagesSizeArray.push({ ...imageSizeData, reducedSize: fileContent });

                return `module.exports = {src: ${path},toString:function(){return ${path}}};`;
            }
        }

        if (query != null) {
            try {
                contentBuffer = await sharp(contentBuffer)
                    .resize(query.width, query.height)
                    .toBuffer();

                const resizedImageBase64 = ImageLoader.moduleExportImageBase64(
                    options.limit,
                    this.resourcePath,
                    contentBuffer,
                    imageSizeData
                );
                if (resizedImageBase64 != null) {
                    return resizedImageBase64;
                }
            } catch (error) {
                console.error(error);
                // if (!options.emitOriginalOnError)
                throw new Error();
            }
        }

        if (this._compiler.options.mode === "production" || options.optimizeInDev === true) {
            ImageLoader.optimizeImage.bind(this)(options, contentBuffer, url, imageSizeData);
        } else {
            ReactwayImageLoaderPlugin.imagesSizeArray.push({ ...imageSizeData, reducedSize: contentBuffer });
            this.emitFile(`${url}`, contentBuffer, options.sourceMap);
        }

        return `module.exports = {src: ${path},toString:function(){return ${path}}};`;
    }
}

const imageLoader: loader.Loader = function(content: string | Buffer): void {
    this.cacheable && this.cacheable();

    const callback = this.async();
    if (callback == null) {
        return;
    }

    const promise = ImageLoader.load.bind(this)(content);
    promise
        .then(result => {
            callback(null, result);
        })
        .catch(err => {
            callback(err);
        });
};

// This indicates that the loader accepts a buffer instead of a string.
imageLoader.raw = true;

export = imageLoader;
