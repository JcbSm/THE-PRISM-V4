import { PrismCommand } from "#structs/PrismCommand";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
export declare class CallComand extends PrismCommand {
    registerApplicationCommands(registry: ApplicationCommandRegistry): Promise<void>;
    chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<import("discord.js").InteractionResponse<boolean> | import("discord.js").Message<boolean> | undefined>;
}
//# sourceMappingURL=call.d.ts.map