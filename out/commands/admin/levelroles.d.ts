import { PrismSubcommand } from "#structs/PrismSubcommand";
import type { ChatInputCommand } from "@sapphire/framework";
export declare class LevelRolesCommand extends PrismSubcommand {
    registerApplicationCommands(registry: ChatInputCommand.Registry): void;
    chatInputRunManage(interaction: PrismSubcommand.ChatInputCommandInteraction): Promise<void>;
    chatInputRunAdd(interaction: PrismSubcommand.ChatInputCommandInteraction): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    private listEmbed;
    private listButton;
    private deleteMenu;
    private getLevelRoles;
}
//# sourceMappingURL=levelroles.d.ts.map