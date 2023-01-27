import { time } from "discord.js";
export class Duration {
    d;
    h;
    m;
    s;
    constructor(resolveable) {
        this.d = 0;
        this.h = 0;
        this.m = 0;
        this.s = 0;
        if (resolveable)
            this.resolve(resolveable);
    }
    get days() {
        return this.d;
    }
    get hours() {
        return this.h;
    }
    get minutes() {
        return this.m;
    }
    get seconds() {
        return this.s;
    }
    resolve(resolveable) {
        if (typeof resolveable == 'string') {
            const resolved = this.resolveStr(resolveable);
            this.d = resolved[0];
            this.h = resolved[1];
            this.m = resolved[2];
            this.s = resolved[3];
        }
        else if (typeof resolveable == 'number') {
            const resolved = this.resolveNum(resolveable);
            this.d = resolved[0];
            this.h = resolved[1];
            this.m = resolved[2];
            this.s = resolved[3];
        }
    }
    resolveStr(str) {
        const arr = [
            str.match(/(\d+)\s*d/),
            str.match(/(\d+)\s*h/),
            str.match(/(\d+)\s*m/),
            str.match(/(\d+)\s*s/)
        ];
        let dur = [0, 0, 0, 0];
        arr.forEach((m, i) => {
            if (m) {
                dur[i] = parseInt(m[1]);
            }
        });
        return dur;
    }
    resolveNum(n) {
        let dur = [0, 0, 0, 0];
        // Ramaining hours
        let rHours = n % (24 * 60 * 60);
        dur[0] = Math.floor(n / (24 * 60 * 60));
        // remaining minutes
        let rMin = rHours % (60 * 60);
        dur[1] = Math.floor(rHours / (60 * 60));
        let rSec = rMin % (60);
        dur[2] = Math.floor(rMin / (60));
        dur[3] = rSec;
        return dur;
    }
    isZero() {
        return !(this.d > 0 || this.h > 0 || this.m > 0 || this.s > 0);
    }
    toMilli() {
        let n = 0;
        n += this.d * 24 * 60 * 60 * 1000;
        n += this.h * 60 * 60 * 1000;
        n += this.m * 60 * 1000;
        n += this.s * 1000;
        return n;
    }
    endTimestamp() {
        return Date.now() + this.toMilli();
    }
    toDate() {
        return new Date(this.endTimestamp());
    }
    toMention(style = 'f') {
        return time(this.toDate(), style);
    }
}
//# sourceMappingURL=duration.js.map