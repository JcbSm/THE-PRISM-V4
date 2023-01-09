import { PrismCommand } from "#structs/PrismCommand";
import type { ApplicationCommandRegistry, ChatInputCommand, ContextMenuCommand } from "@sapphire/framework";
export declare class AvatarCommand extends PrismCommand {
    registerApplicationCommands(registry: ApplicationCommandRegistry): void;
    chatInputRun(interaction: ChatInputCommand.Interaction): void;
    contextMenuRun(interaction: ContextMenuCommand.Interaction): void;
    private reply;
    private embeds;
    private components;
}
//# sourceMappingURL=avatar.d.ts.map