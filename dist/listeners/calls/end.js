import { __decorate } from "tslib";
import { updateMessageComponents } from "#helpers/discord";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
let CallEndListener = class CallEndListener extends PrismListener {
    async run(interaction) {
        if (!(interaction.isButton() && interaction.customId == 'callEnd' && interaction.channel))
            return;
        const call = this.client.calls.get(interaction.channel.id);
        if (!call)
            return;
        await interaction.update({
            components: updateMessageComponents(interaction.message, [{
                    customId: 'callEnd',
                    update(builder) {
                        builder.setDisabled(true);
                    }
                }])
        });
        const reply = (await interaction.followUp({
            content: 'Call will be deleted in 15 seconds.',
            components: [
                new ActionRowBuilder()
                    .setComponents([
                    new ButtonBuilder()
                        .setCustomId('callEndCancel')
                        .setLabel('Cancel')
                        .setStyle(ButtonStyle.Secondary)
                ])
            ]
        }));
        let timeout = setTimeout(async () => {
            call.end();
        }, 15 * 1000);
        reply.createMessageComponentCollector({ max: 2, time: 15 * 1000, filter: (i) => i.isButton() && interaction.user.id == i.user.id && i.customId == 'callEndCancel' })
            .on('collect', async (cancelInteraction) => {
            clearTimeout(timeout);
            await cancelInteraction.message.delete();
            await interaction.editReply({
                components: updateMessageComponents(interaction.message, [{
                        customId: 'callEnd',
                        update(builder) {
                            builder.setDisabled(false);
                        }
                    }])
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
//# sourceMappingURL=end.js.map