import * as fs from "fs-extra";
import upath from "upath";

// Tsconfig.
export const TS_CONFIG_NAME: string = "tsconfig.json";
const DEFAULT_TS_CONFIG_LOCATION: string = upath.resolve(__dirname, `../assets/${TS_CONFIG_NAME}`);

// TsLint.
export const TSLINT_CONFIG_NAME: string = "tslint.json";
const DEFAULT_TSLINT_CONFIG_LOCATION: string = upath.resolve(__dirname, `../assets/${TSLINT_CONFIG_NAME}`);

export function checkTsConfig(projectDirectory: string): void {
    const configLocation = upath.resolve(projectDirectory, TS_CONFIG_NAME);

    if (!fs.pathExistsSync(configLocation)) {
        console.info(`File "${TS_CONFIG_NAME}" not found at ${configLocation}. Creating...`);
        fs.copySync(DEFAULT_TS_CONFIG_LOCATION, configLocation);
        console.info("Created.");
    }
}

export function checkTslintConfig(projectDirectory: string): void {
    const configLocation = upath.resolve(projectDirectory, TSLINT_CONFIG_NAME);

    if (!fs.pathExistsSync(configLocation)) {
        console.info(`File "${TSLINT_CONFIG_NAME}" not found at ${configLocation}. Creating...`);
        fs.copySync(DEFAULT_TSLINT_CONFIG_LOCATION, configLocation);
        console.info("Created.");
    }
}
