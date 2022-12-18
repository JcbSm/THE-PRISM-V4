import { PrismSubcommand } from "#structs/PrismSubcommand";
import type { ChatInputCommand } from "@sapphire/framework";
export declare class ChannelCommand extends PrismSubcommand {
    registerApplicationCommands(registry: ChatInputCommand.Registry): void;
    chatInputRunCounting(interaction: PrismSubcommand.ChatInputInteraction): Promise<void>;
    chatInputRunLevelUp(interaction: PrismSubcommand.ChatInputInteraction): Promise<void>;
}
//# sourceMappingURL=channel.d.ts.map