import { SapphireClient } from "@sapphire/framework";
import { DatabaseClient } from "#lib/DatabaseClient";
import { PrismClientUtil } from "./structures/PrismClientUtil";
export class PrismClient extends SapphireClient {
    constructor(options) {
        super(options);
        this.db = new DatabaseClient(this);
        this.dev = Boolean(process.env.DEV);
        this.util = new PrismClientUtil(this);
    }
}
//# sourceMappingURL=PrismClient.js.map