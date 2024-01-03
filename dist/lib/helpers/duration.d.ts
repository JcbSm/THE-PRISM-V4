import { TimestampStylesString } from "discord.js";
export type RawDuration = {
    d: number;
    h: number;
    m: number;
    s: number;
};
export type DurationResolveable = RawDuration | string | number;
export declare class Duration {
    private d;
    private h;
    private m;
    private s;
    constructor(resolveable?: DurationResolveable);
    get days(): number;
    get hours(): number;
    get minutes(): number;
    get seconds(): number;
    private resolve;
    private resolveStr;
    private resolveNum;
    isZero(): boolean;
    toMilli(): number;
    endTimestamp(): number;
    toDate(): Date;
    toMention(style?: TimestampStylesString): `<t:${bigint}:f>` | `<t:${bigint}:d>` | `<t:${bigint}:t>` | `<t:${bigint}:T>` | `<t:${bigint}:D>` | `<t:${bigint}:F>` | `<t:${bigint}:R>`;
}
export interface Duration {
}
//# sourceMappingURL=duration.d.ts.map