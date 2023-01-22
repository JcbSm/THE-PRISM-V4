import { PrismCommand } from "#structs/PrismCommand";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
export declare class PokerCommand extends PrismCommand {
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<void>;
}
//# sourceMappingURL=blackjack.d.ts.map