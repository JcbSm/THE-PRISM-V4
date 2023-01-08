import { Precondition } from "@sapphire/framework";
export class PrismPrecondition extends Precondition {
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
//# sourceMappingURL=PrismPrecondition.js.map