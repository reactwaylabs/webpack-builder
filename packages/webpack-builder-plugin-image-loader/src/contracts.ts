export interface ImageSizeData {
    filePath: string;
    rawRequest: string;
    requestedFilePath: string;
    originalSize: Buffer;
    reducedSize?: Buffer;
    isBase64?: boolean;
}

export interface ImageLoaderOptions {
    name: string;
    limit: string | number;
    sourceMap: boolean;
    optimizeInDev: boolean;
    optimization: ImagesOptimization;
    outputFolder: string;
}

export interface ImagesOptimization {
    /**
     * Check https://github.com/imagemin/imagemin-mozjpeg#imageminmozjpegoptionsbuffer for types.
     */
    mozjpeg?: { [key: string]: any };
    /**
     * https://www.npmjs.com/package/imagemin-optipng#imageminoptipngoptionsbuffer for types.
     */
    optipng?: { [key: string]: any };
    /**
     * https://www.npmjs.com/package/imagemin-pngquant#imageminpngquantoptionsinput for types.
     */
    pngquant?: { [key: string]: any };
    /**
     * Check https://github.com/imagemin/imagemin-gifsicle#imagemingifsicleoptionsbuffer for types.
     */
    gifsicle?: { [key: string]: any };
    /**
     * https://www.npmjs.com/package/imagemin-svgo#imageminsvgooptionsbuffer for types.
     */
    svgo?: { [key: string]: any };
    /**
     * https://www.npmjs.com/package/imagemin-webp#imageminwebpoptionsbuffer for types.
     */
    webp?: { [key: string]: any };
}

export interface FileNameQuery {
    textQuery: string;
    width?: number;
    height?: number;
}
