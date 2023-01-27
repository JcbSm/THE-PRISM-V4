import { PrismCommand } from "#structs/PrismCommand";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
export declare class CountingCommand extends PrismCommand {
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    contextMenuRun(interaction: PrismCommand.ContextMenuInteraction): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    private getEmbed;
}
//# sourceMappingURL=counting.d.ts.map