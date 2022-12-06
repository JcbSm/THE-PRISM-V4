import { ChatInputCommand, Command } from "@sapphire/framework";
export declare class PingCommand extends Command {
    constructor(context: Command.Context, options: Command.Options);
    registerApplicationCommands(registry: ChatInputCommand.Registry): void;
    chatInputRun(interaction: Command.ChatInputInteraction): Promise<unknown>;
}
//# sourceMappingURL=ping.d.ts.map