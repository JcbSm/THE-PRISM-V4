import { Subcommand } from "@sapphire/plugin-subcommands";
export declare abstract class PrismSubcommand extends Subcommand {
    constructor(context: PrismSubcommand.Context, options: PrismSubcommand.Options);
    get client(): import("@sapphire/framework").SapphireClient<boolean>;
    get db(): import("../DatabaseClient").DatabaseClient;
}
export declare namespace PrismSubcommand {
    type Options = Subcommand.Options & {};
    type Context = Subcommand.Context & {};
    type ChatInputInteraction = Subcommand.ChatInputInteraction & {};
}
//# sourceMappingURL=PrismSubcommand.d.ts.map