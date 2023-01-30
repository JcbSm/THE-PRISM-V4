import { updateMessageComponents } from "#helpers/discord";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { ButtonBuilder, ChannelType, Interaction } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: 'interactionCreate'
})

export class CallIncUserLimitListener extends PrismListener {
    public async run(interaction: Interaction) {

        if (!(interaction.isButton() && interaction.customId == 'callIncUserLimit' && interaction.channel && interaction.guild && interaction.channel.type == ChannelType.GuildVoice)) return;

        const call = this.client.calls.get(interaction.channel.id)  || await this.client.calls.recreate(interaction, interaction.guild, interaction.channel);
        
        if (call.userId !== interaction.user.id) {
            interaction.reply({ ephemeral: true, content: 'You cannot modify someone else\'s call' })
            return;
        }

        await interaction.update({
            components: updateMessageComponents(interaction.message, [
                {
                    customId: 'callIncUserLimit',
                    update(builder: ButtonBuilder) {
                        builder.setDisabled(true)
                    }
                },
                {
                    customId: 'callDecUserLimit',
                    update(builder: ButtonBuilder) {
                        builder.setDisabled(true)
                    }
                }
            ])
        })

        await call.setUserLimit(call.userLimit + 1);

        await interaction.editReply({
            embeds: [ await call.getOptionsEmbed() ],
            components: updateMessageComponents(interaction.message, [
                {
                    customId: 'callIncUserLimit',
                    update(builder: ButtonBuilder) {
                        builder.setDisabled(call.userLimit == 99 ? true : false)
                    }
                },
                {
                    customId: 'callDecUserLimit',
                    update(builder: ButtonBuilder) {
                        builder.setDisabled(false)
                    }
                }
            ])
        })
    }
}