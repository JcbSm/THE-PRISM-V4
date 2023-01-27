/**
 * Generates a random integer between two values (min, max) inclusively.
 * @param min Minimum int
 * @param max Maximum int
 * @returns Random int
 */
export function rng(min: number = 0, max: number = 1): number {
    return Math.floor(Math.random() * ((1+max)-min)) + min;
}

/**
 * Groups an integer into 3 digits separated by commas
 * @param n Number to group
 * @returns Formed string
 */
export function groupDigits(n: number): string {
    let arr = Math.abs(n).toString().split('').reverse();
    for (let i = 3; i < arr.length; i += 4) {
        arr.splice(i, 0, ',');
    }
    n < 0 ? arr.push('-') : {};
    return arr.reverse().join("");
};

export function factors(n: number) {
    let factors: number[] = [];
    for (let i = 0; i < n; i++)
        if (n % i == 0) factors.push(i);
    return factors;
}

export function pad(n: number | string, size: number) {
    let s = new Array(size).fill('0').join("") + n;
    return s.substring(s.length-size);
}

/**
 * Returns a percentage
 * @param numerator Top
 * @param denominator Button
 * @param d Number of decimal places
 * @returns {string} Percentage
 */
export function percentage(numerator: number, denominator: number, d: number) {
    return `${Math.round((Math.pow(10, d + 2)*numerator)/(denominator))/Math.pow(10, d)}%`
}