import { Duration } from "#helpers/duration";
import { SimplePoll, StandardPoll } from "#lib/polls/Poll";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { Events } from "@sapphire/framework";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, GuildMember, Interaction } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: Events.InteractionCreate
})

export class PollCreateListener extends PrismListener {
    public override async run(interaction: Interaction) {

        if (!interaction.isModalSubmit() || interaction.customId !== 'pollModal' || !interaction.channel || !interaction.channel.isTextBased()) return;

        const question = interaction.fields.getTextInputValue('pollQuestion');
        const options = interaction.fields.getTextInputValue('pollOptions').split("\n");
        const duration = new Duration(interaction.fields.getTextInputValue('pollTimer'));
        const author = interaction.member instanceof GuildMember ? interaction.member : interaction.user

        await interaction.reply({ ephemeral: true, content: 'Select the type of poll', components: [
            new ActionRowBuilder<ButtonBuilder>()
                .setComponents([
                    new ButtonBuilder()
                        .setCustomId('pollTypeButton')
                        .setLabel('Standard')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('pollTypeReact')
                        .setLabel('Simple')
                        .setStyle(ButtonStyle.Secondary),
                ])
        ] })

        const reply = await interaction.fetchReply();

        const simple = await reply.awaitMessageComponent({ componentType: ComponentType.Button, time: 30 * 1000, filter: (i: ButtonInteraction) => i.user.id == interaction.user.id }).then((interaction: ButtonInteraction) => {
            if (interaction.customId === 'pollTypeReact')
                return 1;
            else return 0;
        }).catch(() => 1)

        await interaction.deleteReply();

        const poll = simple ? new SimplePoll(author, interaction.channel, { question, options, duration }) : new StandardPoll(author, interaction.channel, { question, options, duration })

        await poll.send();
    }
}