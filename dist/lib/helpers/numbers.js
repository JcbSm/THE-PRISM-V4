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
export function factors(n) {
    let factors = [];
    for (let i = 0; i < n; i++)
        if (n % i == 0)
            factors.push(i);
    return factors;
}
export function pad(n, size) {
    let s = new Array(size).fill('0').join("") + n;
    return s.substring(s.length - size);
}
//# sourceMappingURL=numbers.js.map