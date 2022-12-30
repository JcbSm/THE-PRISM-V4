import path from "path";
import { fileURLToPath } from "url";
/**
 * Converts import.meta.url to standard __dirname __filename format.
 * @param url import.meta.url
 * @returns File
 */
export function parseURL(url) {
    const __filename = fileURLToPath(url);
    const __dirname = path.dirname(__filename);
    return { __filename, __dirname };
}
/**
 * Gets the name of the directory of a File
 * @param file File to parse
 * @returns Directory name
 */
export function dirname(file) {
    return file.__dirname.split(path.sep).pop();
}
/**
 * Get the name of the directory for the current file.
 * @param url
 * @returns Directory name
 */
export function getDirname(url) {
    return dirname(parseURL(url));
}
//# sourceMappingURL=files.js.map