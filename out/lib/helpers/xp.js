export function requiredXP(level) {
    return Math.floor(5 * Math.pow(135, 2) * ((Math.pow(10, 3) * Math.exp(-Math.pow(10, -3) * level) + level) - Math.pow(10, 3)));
}
;
export function levelCalc(xp) {
    let level = 0;
    while (xp > requiredXP(level + 1)) {
        level++;
    }
    ;
    return level;
}
;
//# sourceMappingURL=xp.js.map