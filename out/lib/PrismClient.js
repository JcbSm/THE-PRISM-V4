import { SapphireClient } from "@sapphire/framework";
import { DatabaseClient } from "#lib/DatabaseClient";
import { PrismClientUtil } from "#structs/PrismClientUtil";
export class PrismClient extends SapphireClient {
    constructor(options) {
        super(options);
        this.db = new DatabaseClient(this);
        this.dev = process.env.DEV == 'true';
        this.util = new PrismClientUtil(this);
        this.devGuildId = '569556194612740115';
    }
}
//# sourceMappingURL=PrismClient.js.map