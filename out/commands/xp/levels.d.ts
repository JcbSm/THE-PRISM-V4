import { PrismCommand } from "#structs/PrismCommand";
import type { ChatInputCommand } from "@sapphire/framework";
export declare class LeaderboardCommand extends PrismCommand {
    registerApplicationCommands(registry: ChatInputCommand.Registry): void;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<void>;
}
//# sourceMappingURL=levels.d.ts.map