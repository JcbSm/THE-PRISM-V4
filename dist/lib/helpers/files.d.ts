export type File = {
    __filename: string;
    __dirname: string;
};
/**
 * Converts import.meta.url to standard __dirname __filename format.
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
export declare function getDirname(url: string): string | undefined;
//# sourceMappingURL=files.d.ts.map