import path from "path";
import { fileURLToPath } from "url";
/**
 * Converts import.meta.url to standard dirpath filepath format.
 * @param url import.meta.url
 * @returns File
 */
export function parseURL(url) {
    const filepath = fileURLToPath(url);
    const dirpath = path.dirname(filepath);
    return { filepath, dirpath };
}
/**
 * Gets the name of the directory of a File
 * @param file File to parse
 * @returns Directory name
 */
export function dirname(file) {
    return file.dirpath.split(path.sep).pop();
}
/**
 * Get the name of the directory for the current file.
 * @param url
 * @returns Directory name
 */
export function parseDirname(url) {
    return dirname(parseURL(url));
}
//# sourceMappingURL=files.js.map