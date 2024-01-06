import { PrismCommand } from "#structs/PrismCommand";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
export declare class HandgrabCommand extends PrismCommand {
    registerApplicationCommands(reigistry: ApplicationCommandRegistry): void;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<import("discord.js").Message<true> | import("discord.js").Message<false> | undefined>;
    private getAttachmentsText;
    private getAttachments;
}
//# sourceMappingURL=handgrab.d.ts.map