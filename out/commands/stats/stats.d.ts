import { PrismCommand } from "#structs/PrismCommand";
import type { ChatInputCommand } from "@sapphire/framework";
export declare class StatCommand extends PrismCommand {
    registerApplicationCommands(registry: ChatInputCommand.Registry): void;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<unknown>;
}
//# sourceMappingURL=stats.d.ts.map