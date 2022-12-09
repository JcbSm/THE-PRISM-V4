import { Command } from "@sapphire/framework";
export declare abstract class PrismCommand extends Command {
    constructor(context: Command.Context, options: Command.Options);
    get client(): import("@sapphire/framework").SapphireClient<boolean>;
    get db(): import("../DatabaseClient").DatabaseClient;
}
export declare namespace PrismCommand {
    type Options = Command.Options;
    type Context = Command.Context;
    type ChatInputCommand = Command.ChatInputInteraction;
    type ChatInputInteraction = Command.ChatInputInteraction;
}
//# sourceMappingURL=PrismCommand.d.ts.map