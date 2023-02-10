import { PrismCommand } from "#structs/PrismCommand";
import type { ChatInputCommand } from "@sapphire/framework";
export declare class RibyCommand extends PrismCommand {
    registerApplicationCommands(registry: ChatInputCommand.Registry): void;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<void>;
    private drawRiby;
}
//# sourceMappingURL=ribyquote.d.ts.map