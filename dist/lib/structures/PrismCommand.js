import { Command } from "@sapphire/framework";
export class PrismCommand extends Command {
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
;
//# sourceMappingURL=PrismCommand.js.map