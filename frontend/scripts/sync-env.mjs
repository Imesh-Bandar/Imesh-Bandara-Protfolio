import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const envPath = resolve(root, '.env');
const devOutputPath = resolve(root, 'src/environments/environment.ts');
const outputPath = resolve(root, 'src/environments/environment.prod.ts');

const defaults = {
    API_BASE_URL: '/api',
    ASSET_BASE_URL: ''
};

function parseEnv(source) {
    const result = {};

    for (const rawLine of source.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;

        const exportPrefix = line.startsWith('export ') ? line.slice(7).trim() : line;
        const separatorIndex = exportPrefix.indexOf('=');
        if (separatorIndex === -1) continue;

        const key = exportPrefix.slice(0, separatorIndex).trim();
        let value = exportPrefix.slice(separatorIndex + 1).trim();

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        result[key] = value;
    }

    return result;
}

const fileValues = existsSync(envPath) ? parseEnv(readFileSync(envPath, 'utf8')) : {};
const apiBaseUrl = fileValues.API_BASE_URL || defaults.API_BASE_URL;
const assetBaseUrl = fileValues.ASSET_BASE_URL ?? defaults.ASSET_BASE_URL;
const prodApiBaseUrl = fileValues.PROD_API_BASE_URL || apiBaseUrl;
const prodAssetBaseUrl = fileValues.PROD_ASSET_BASE_URL ?? assetBaseUrl;

const devOutput = `export const environment = {\n  production: false,\n  apiBaseUrl: ${JSON.stringify(apiBaseUrl)},\n  assetBaseUrl: ${JSON.stringify(assetBaseUrl)}\n};\n`;

const prodOutput = `export const environment = {\n  production: true,\n  apiBaseUrl: ${JSON.stringify(prodApiBaseUrl)},\n  assetBaseUrl: ${JSON.stringify(prodAssetBaseUrl)}\n};\n`;

writeFileSync(devOutputPath, devOutput, 'utf8');
writeFileSync(outputPath, prodOutput, 'utf8');
