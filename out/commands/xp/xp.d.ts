import { PrismCommand } from "#structs/PrismCommand";
import type { ChatInputCommand } from "@sapphire/framework";
export declare class XpCommand extends PrismCommand {
    registerApplicationCommands(registry: ChatInputCommand.Registry): void;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<unknown>;
}
//# sourceMappingURL=xp.d.ts.map