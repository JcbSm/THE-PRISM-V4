import { Subcommand } from "@sapphire/plugin-subcommands";
export declare abstract class PrismSubcommand extends Subcommand {
    constructor(context: PrismSubcommand.Context, options: PrismSubcommand.Options);
    get client(): import("@sapphire/framework").SapphireClient<boolean>;
    get db(): import("../database/DatabaseClient").DatabaseClient;
}
export declare namespace PrismSubcommand {
    type Options = Subcommand.Options & {};
    type Context = Subcommand.Context & {};
    type ChatInputCommandInteraction = Subcommand.ChatInputCommandInteraction & {};
}
//# sourceMappingURL=PrismSubcommand.d.ts.map