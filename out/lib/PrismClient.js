import { SapphireClient } from "@sapphire/framework";
import { DatabaseClient } from "#lib/DatabaseClient";
import { PrismClientUtil } from "#structs/PrismClientUtil";
export class PrismClient extends SapphireClient {
    constructor(options) {
        super(options);
        this.db = new DatabaseClient(this);
        console.log(process.env.DEV);
        this.dev = Boolean(process.env.DEV);
        console.log(this.dev);
        this.util = new PrismClientUtil(this);
        this.devGuildId = '569556194612740115';
    }
}
//# sourceMappingURL=PrismClient.js.map