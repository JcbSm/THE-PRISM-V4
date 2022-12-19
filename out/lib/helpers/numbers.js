/**
 * Generates a random integer between two values (min, max) inclusively.
 * @param min Minimum int
 * @param max Maximum int
 * @returns Random int
 */
export function rng(min = 0, max = 1) {
    return Math.floor(Math.random() * ((1 + max) - min)) + min;
}
//# sourceMappingURL=numbers.js.map