/**
 * Generates a random integer between two values (min, max) inclusively.
 * @param min Minimum int
 * @param max Maximum int
 * @returns Random int
 */
export declare function rng(min?: number, max?: number): number;
/**
 * Groups an integer into 3 digits separated by commas
 * @param n Number to group
 * @returns Formed string
 */
export declare function groupDigits(n: number): string;
export declare function factors(n: number): number[];
export declare function pad(n: number | string, size: number): string;
/**
 * Returns a percentage
 * @param numerator Top
 * @param denominator Button
 * @param d Number of decimal places
 * @returns {string} Percentage
 */
export declare function percentage(numerator: number, denominator: number, d: number): string;
//# sourceMappingURL=numbers.d.ts.map