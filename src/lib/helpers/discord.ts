import { ActionRowBuilder, ButtonBuilder, ChannelSelectMenuBuilder, GuildChannel, StringSelectMenuBuilder } from "discord.js";
import type { Message } from "discord.js";

export type ActionRowComponentBuilders =
    | ButtonBuilder
    | StringSelectMenuBuilder
    | ChannelSelectMenuBuilder

export interface UpdateMessageComponentsOptions {
    customId: string;
    update(builder: ActionRowComponentBuilders): void;
}

export function updateMessageComponents(message: Message, options: UpdateMessageComponentsOptions[]): ActionRowBuilder<ActionRowComponentBuilders>[] {

    let components = [...message.components].map(row => ActionRowBuilder.from(row) as ActionRowBuilder<ActionRowComponentBuilders>)

    for (const component of options) {

        const row = message.components.findIndex(row => row.components.find(c => c.customId == component.customId));
        const index = message.components[row].components.findIndex(c => c.customId == component.customId);

        component.update(components[row].components[index]);
    }

    return components;

}

export function isChannelPublic(channel: GuildChannel) {
    return channel.permissionsFor(channel.guild.roles.everyone.id)?.serialize().ViewChannel || false;
}

export function getIdFromMention(mention: string) {
    return mention.replace(/\D/gi, '');
}