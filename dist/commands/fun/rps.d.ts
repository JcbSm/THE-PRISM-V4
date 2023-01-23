import { PrismCommand } from "#structs/PrismCommand";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
export declare class RockPaperScissorsCommand extends PrismCommand {
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    private rps;
    private winner;
}
//# sourceMappingURL=rps.d.ts.map