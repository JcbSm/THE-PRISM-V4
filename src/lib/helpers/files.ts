import path from "path";
import { fileURLToPath } from "url";

export type File = {
    filepath: string;
    dirpath: string;
}

/**
 * Converts import.meta.url to standard dirpath filepath format.
 * @param url import.meta.url
 * @returns File
 */
export function parseURL(url: string): File {

    const filepath = fileURLToPath(url);
    const dirpath = path.dirname(filepath);

    return { filepath, dirpath }

}

/**
 * Gets the name of the directory of a File
 * @param file File to parse
 * @returns Directory name
 */
export function dirname(file: File) {
    return file.dirpath.split(path.sep).pop();
}

/**
 * Get the name of the directory for the current file.
 * @param url 
 * @returns Directory name
 */
export function parseDirname(url: string) {
    return dirname(parseURL(url))
}