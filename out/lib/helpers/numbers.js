/**
 * Generates a random integer between two values (min, max) inclusively.
 * @param min Minimum int
 * @param max Maximum int
 * @returns Random int
 */
export function rng(min = 0, max = 1) {
    return Math.floor(Math.random() * ((1 + max) - min)) + min;
}
/**
 * Groups an integer into 3 digits separated by commas
 * @param n Number to group
 * @returns Formed string
 */
export function groupDigits(n) {
    let arr = Math.abs(n).toString().split('').reverse();
    for (let i = 3; i < arr.length; i += 4) {
        arr.splice(i, 0, ',');
    }
    n < 0 ? arr.push('-') : {};
    return arr.reverse().join("");
}
;
//# sourceMappingURL=numbers.js.map