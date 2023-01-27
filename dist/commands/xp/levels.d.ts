import { PrismCommand } from "#structs/PrismCommand";
import type { ChatInputCommand } from "@sapphire/framework";
export declare class LeaderboardCommand extends PrismCommand {
    registerApplicationCommands(registry: ChatInputCommand.Registry): void;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<import("discord.js").Message<boolean> | import("discord.js").InteractionResponse<boolean> | undefined>;
}
//# sourceMappingURL=levels.d.ts.map