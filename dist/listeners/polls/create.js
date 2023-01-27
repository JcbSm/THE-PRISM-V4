import { __decorate } from "tslib";
import { Duration } from "#helpers/duration";
import { SimplePoll, StandardPoll } from "#lib/polls/Poll";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { Events } from "@sapphire/framework";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, GuildMember } from "discord.js";
let PollCreateListener = class PollCreateListener extends PrismListener {
    async run(interaction) {
        if (!interaction.isModalSubmit() || interaction.customId !== 'pollModal' || !interaction.channel || !interaction.channel.isTextBased())
            return;
        const question = interaction.fields.getTextInputValue('pollQuestion');
        const options = interaction.fields.getTextInputValue('pollOptions').split("\n");
        const duration = new Duration(interaction.fields.getTextInputValue('pollTimer'));
        const author = interaction.member instanceof GuildMember ? interaction.member : interaction.user;
        await interaction.reply({ ephemeral: true, content: 'Select the type of poll', components: [
                new ActionRowBuilder()
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
            ] });
        const reply = await interaction.fetchReply();
        const simple = await reply.awaitMessageComponent({ componentType: ComponentType.Button, time: 30 * 1000, filter: (i) => i.user.id == interaction.user.id }).then((interaction) => {
            if (interaction.customId === 'pollTypeReact')
                return 1;
            else
                return 0;
        }).catch(() => 1);
        await interaction.deleteReply();
        const poll = simple ? new SimplePoll(author, interaction.channel, { question, options, duration }) : new StandardPoll(author, interaction.channel, { question, options, duration });
        await poll.send();
    }
};
PollCreateListener = __decorate([
    ApplyOptions({
        event: Events.InteractionCreate
    })
], PollCreateListener);
export { PollCreateListener };
//# sourceMappingURL=create.js.map