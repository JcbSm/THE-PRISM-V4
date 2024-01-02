import { ActionRowBuilder, ButtonBuilder, ChannelSelectMenuBuilder, GuildChannel, StringSelectMenuBuilder } from "discord.js";
import type { AnyComponentBuilder, Message, MessageActionRowComponentBuilder, RoleSelectMenuBuilder, UserSelectMenuBuilder } from "discord.js";
export type ActionRowComponentBuilders = ButtonBuilder | StringSelectMenuBuilder | ChannelSelectMenuBuilder | UserSelectMenuBuilder | RoleSelectMenuBuilder;
export interface UpdateMessageComponentsOptions {
    customId: string;
    update(builder: AnyComponentBuilder): void;
}
export declare function updateMessageComponents(message: Message, options: UpdateMessageComponentsOptions[]): ActionRowBuilder<MessageActionRowComponentBuilder>[];
export declare function isChannelPublic(channel: GuildChannel): boolean;
export declare function getIdFromMention(mention: string): string;
//# sourceMappingURL=discord.d.ts.map