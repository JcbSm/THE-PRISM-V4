import { Listener } from "@sapphire/framework";
export class PrismListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options
        });
    }
    get client() {
        return this.container.client;
    }
    get db() {
        return this.client.db;
    }
}
//# sourceMappingURL=PrismListener.js.map