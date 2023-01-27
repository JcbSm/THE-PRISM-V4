import { PrismCommand } from "#structs/PrismCommand";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
export declare class SimplePollCommand extends PrismCommand {
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<void>;
    contextMenuRun(interaction: PrismCommand.ContextMenuInteraction): Promise<void>;
    private getModal;
}
//# sourceMappingURL=simplepoll.d.ts.map