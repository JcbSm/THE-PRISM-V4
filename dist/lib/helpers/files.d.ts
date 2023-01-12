export type File = {
    filepath: string;
    dirpath: string;
};
/**
 * Converts import.meta.url to standard dirpath filepath format.
 * @param url import.meta.url
 * @returns File
 */
export declare function parseURL(url: string): File;
/**
 * Gets the name of the directory of a File
 * @param file File to parse
 * @returns Directory name
 */
export declare function dirname(file: File): string | undefined;
/**
 * Get the name of the directory for the current file.
 * @param url
 * @returns Directory name
 */
export declare function parseDirname(url: string): string | undefined;
//# sourceMappingURL=files.d.ts.map