import { PrismSubcommand } from "#structs/PrismSubcommand";
import type { ChatInputCommand } from "@sapphire/framework";
export declare class ChannelCommand extends PrismSubcommand {
    registerApplicationCommands(registry: ChatInputCommand.Registry): void;
    chatInputRunCounting(interaction: PrismSubcommand.ChatInputCommandInteraction): Promise<import("discord.js").Message<true> | import("discord.js").InteractionResponse<boolean> | undefined>;
    chatInputRunLevelUp(interaction: PrismSubcommand.ChatInputCommandInteraction): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
}
//# sourceMappingURL=channel.d.ts.map