import { Subcommand } from "@sapphire/plugin-subcommands";
export class PrismSubcommand extends Subcommand {
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
//# sourceMappingURL=PrismSubcommand.js.map