import { ActionRowBuilder } from "discord.js";
export function updateMessageComponents(message, options) {
    let components = [...message.components].map(row => {
        return ActionRowBuilder.from(row);
    });
    for (const component of options) {
        const row = message.components.findIndex(row => row.components.find(c => c.customId == component.customId));
        const index = message.components[row].components.findIndex(c => c.customId == component.customId);
        component.update(components[row].components[index]);
    }
    return components;
}
export function isChannelPublic(channel) {
    return channel.permissionsFor(channel.guild.roles.everyone.id)?.serialize().ViewChannel || false;
}
export function getIdFromMention(mention) {
    return mention.replace(/\D/gi, '');
}
//# sourceMappingURL=discord.js.map