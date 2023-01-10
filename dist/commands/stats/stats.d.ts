import { PrismCommand } from "#structs/PrismCommand";
import type { ChatInputCommand, ContextMenuCommand } from "@sapphire/framework";
export declare class StatCommand extends PrismCommand {
    registerApplicationCommands(registry: ChatInputCommand.Registry): void;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<unknown>;
    contextMenuRun(interaction: ContextMenuCommand.Interaction): Promise<import("discord.js").Message<boolean> | undefined>;
    private reply;
}
//# sourceMappingURL=stats.d.ts.map