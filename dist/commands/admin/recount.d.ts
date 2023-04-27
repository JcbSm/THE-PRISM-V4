import { PrismCommand } from "#structs/PrismCommand";
import type { ChatInputCommand } from "@sapphire/framework";
import { Message } from "discord.js";
export declare class CountCountsCommand extends PrismCommand {
    registerApplicationCommands(registry: ChatInputCommand.Registry): void;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<Message<boolean> | undefined>;
}
//# sourceMappingURL=recount.d.ts.map