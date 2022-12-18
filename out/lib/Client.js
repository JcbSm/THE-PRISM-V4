import { SapphireClient } from "@sapphire/framework";
import { DatabaseClient } from "#lib/DatabaseClient";
export class PrismClient extends SapphireClient {
    constructor(options) {
        super(options);
        this.db = new DatabaseClient(this);
        this.dev = Boolean(process.env.DEV);
    }
}
//# sourceMappingURL=Client.js.map