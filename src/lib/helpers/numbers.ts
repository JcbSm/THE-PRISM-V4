/**
 * Generates a random integer between two values (min, max) inclusively.
 * @param min Minimum int
 * @param max Maximum int
 * @returns Random int
 */
export function rng(min: number = 0, max: number = 1): number {
    return Math.floor(Math.random() * ((1+max)-min)) + min;
}