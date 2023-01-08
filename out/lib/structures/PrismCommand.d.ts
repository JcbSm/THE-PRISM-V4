import { Command } from "@sapphire/framework";
export declare abstract class PrismCommand extends Command {
    constructor(context: PrismCommand.Context, options: PrismCommand.Options);
    get client(): import("@sapphire/framework").SapphireClient<boolean>;
    get db(): import("../database/DatabaseClient").DatabaseClient;
}
export declare namespace PrismCommand {
    type Options = Command.Options;
    type Context = Command.Context;
    type ChatInputCommand = Command.ChatInputCommandInteraction;
    type ChatInputInteraction = Command.ChatInputCommandInteraction;
    type ContextMenuInteraction = Command.ContextMenuCommandInteraction;
}
//# sourceMappingURL=PrismCommand.d.ts.map