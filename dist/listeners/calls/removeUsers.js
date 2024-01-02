import { __decorate } from "tslib";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { ActionRowBuilder, ChannelType, UserSelectMenuBuilder } from "discord.js";
let CallEndListener = class CallEndListener extends PrismListener {
    async run(interaction) {
        if (!(interaction.isButton() && interaction.customId == 'callRemoveUsers' && interaction.channel && interaction.guild && interaction.channel.type == ChannelType.GuildVoice))
            return;
        const call = this.client.calls.get(interaction.channel.id) || await this.client.calls.recreate(interaction, interaction.guild, interaction.channel);
        if (call.userId !== interaction.user.id) {
            interaction.reply({ ephemeral: true, content: 'You cannot modify someone else\'s call' });
            return;
        }
        const reply = (await interaction.reply({
            fetchReply: true,
            ephemeral: true,
            content: 'Select the users you wish to remove.',
            components: [
                new ActionRowBuilder()
                    .setComponents([
                    new UserSelectMenuBuilder()
                        .setCustomId('callRemoveUsersSelect')
                        .setMaxValues(25)
                ])
            ]
        }));
        reply.createMessageComponentCollector({ max: 2, time: 15 * 1000 })
            .on('collect', async (selectInteraction) => {
            Promise.all(selectInteraction.values.map((userId) => {
                return call.removeUser(userId);
            }));
            selectInteraction.update({
                content: "Updated users.",
                components: []
            });
        });
    }
};
CallEndListener = __decorate([
    ApplyOptions({
        event: 'interactionCreate'
    })
], CallEndListener);
export { CallEndListener };
//# sourceMappingURL=removeUsers.js.map