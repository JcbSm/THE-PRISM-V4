import { ActionRowBuilder, ButtonBuilder, ChannelSelectMenuBuilder, GuildChannel, StringSelectMenuBuilder } from "discord.js";
import type { Message } from "discord.js";
export type ActionRowComponentBuilders = ButtonBuilder | StringSelectMenuBuilder | ChannelSelectMenuBuilder;
export interface UpdateMessageComponentsOptions {
    customId: string;
    update(builder: ActionRowComponentBuilders): void;
}
export declare function updateMessageComponents(message: Message, options: UpdateMessageComponentsOptions[]): ActionRowBuilder<ActionRowComponentBuilders>[];
export declare function isChannelPublic(channel: GuildChannel): boolean;
export declare function getIdFromMention(mention: string): string;
//# sourceMappingURL=discord.d.ts.map