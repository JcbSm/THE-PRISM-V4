import { updateMessageComponents } from "#helpers/discord";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Interaction } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: 'interactionCreate'
})

export class CallEndListener extends PrismListener {
    public async run(interaction: Interaction) {

        if (!(interaction.isButton() && interaction.customId == 'callEnd' && interaction.channel && interaction.guild && interaction.channel.type == ChannelType.GuildVoice)) return;

        const call = this.client.calls.get(interaction.channel.id)  || await this.client.calls.recreate(interaction, interaction.guild, interaction.channel);

        await interaction.update({
            components: updateMessageComponents(interaction.message, [{
                customId: 'callEnd',
                update (builder: ButtonBuilder) {
                    builder.setDisabled(true)
                }
            }])
        })

        const reply = (await interaction.followUp({
            content: 'Call will be deleted in 15 seconds.',
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents([
                        new ButtonBuilder()
                            .setCustomId('callEndCancel')
                            .setLabel('Cancel')
                            .setStyle(ButtonStyle.Secondary)
                    ])
            ]
        }))

        let timeout = setTimeout(async () => {
            call.end();
        }, 15 * 1000)

        reply.createMessageComponentCollector({ max: 2, time: 15 * 1000, filter: (i: Interaction) => i.isButton() && interaction.user.id == i.user.id && i.customId == 'callEndCancel' })
            .on('collect', async (cancelInteraction: ButtonInteraction) => {

                clearTimeout(timeout);

                await cancelInteraction.message.delete();

                await interaction.editReply({
                    components: updateMessageComponents(interaction.message, [{
                        customId: 'callEnd',
                        update (builder: ButtonBuilder) {
                            builder.setDisabled(false)
                        }
                    }])
                })
            })

    }
}