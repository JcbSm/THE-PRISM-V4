import { PrismCommand } from "#structs/PrismCommand";
import type { ApplicationCommandRegistry, ChatInputCommand } from "@sapphire/framework";
export declare class RollCommand extends PrismCommand {
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
    chatInputRun(interaction: ChatInputCommand.Interaction): Promise<import("discord.js").InteractionResponse<boolean>>;
}
//# sourceMappingURL=roll.d.ts.map