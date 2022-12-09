import { SapphireClient } from "@sapphire/framework";
import { DatabaseClient } from "#lib/DatabaseClient";
export class PrismClient extends SapphireClient {
    constructor(options) {
        super(options);
        this.db = new DatabaseClient(this);
    }
}
//# sourceMappingURL=Client.js.map