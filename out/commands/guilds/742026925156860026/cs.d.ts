import { PrismCommand } from "#structs/PrismCommand";
import type { ChatInputCommand } from "@sapphire/framework";
export default class extends PrismCommand {
    constructor(context: PrismCommand.Context, { ...options }: PrismCommand.Options);
    registerApplicationCommands(registry: ChatInputCommand.Registry): void;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<import("discord.js").InteractionResponse<boolean>>;
}
//# sourceMappingURL=cs.d.ts.map