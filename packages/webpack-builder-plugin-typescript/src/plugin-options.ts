import { NormalizedMessage } from "fork-ts-checker-webpack-plugin/lib/NormalizedMessage";

export type Formatter = (message: NormalizedMessage, useColors: boolean) => string;

export interface Logger {
    // tslint:disable-next-line no-any
    error(message?: any): void;
    // tslint:disable-next-line no-any
    warn(message?: any): void;
    // tslint:disable-next-line no-any
    info(message?: any): void;
}

export interface ForkTsCheckerWebpackPluginOptions {
    typescript: string;
    tsconfig: string;
    compilerOptions: object;
    tslint: string | true;
    tslintAutoFix: boolean;
    watch: string | string[];
    async: boolean;
    ignoreDiagnostics: number[];
    ignoreLints: string[];
    ignoreLintWarnings: boolean;
    reportFiles: string[];
    colors: boolean;
    logger: Logger;
    formatter: "default" | "codeframe" | Formatter;
    // tslint:disable-next-line no-any
    formatterOptions: any;
    silent: boolean;
    checkSyntacticErrors: boolean;
    memoryLimit: number;
    workers: number;
    vue: boolean;
    useTypescriptIncrementalApi: boolean;
    measureCompilationTime: boolean;
}
