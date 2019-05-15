export interface ImageSizeData {
    filePath: string;
    rawRequest: string;
    requestedFilePath: string;
    // FIXME: Change to number;
    originalSize: Buffer;
    // FIXME: Change to number;
    reducedSize?: Buffer;
    isBase64?: boolean;
}
