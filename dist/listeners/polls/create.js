import { __decorate } from "tslib";
import { Duration } from "#helpers/duration";
import { SimplePoll, StandardPoll } from "#lib/polls/Poll";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { Events } from "@sapphire/framework";
let PollCreateListener = class PollCreateListener extends PrismListener {
    async run(interaction) {
        if (!interaction.isModalSubmit() || !(interaction.customId === 'pollModal' || interaction.customId === 'pollSimpleModal') || !interaction.channel || !interaction.channel.isTextBased())
            return;
        const question = interaction.fields.getTextInputValue('pollQuestion');
        const options = interaction.fields.getTextInputValue('pollOptions').split("\n");
        const poll = interaction.customId === 'pollSimpleModal'
            ? new SimplePoll(interaction, interaction.channel, { question, options }, this.client)
            : new StandardPoll(interaction, interaction.channel, { question, options, duration: new Duration(interaction.fields.getTextInputValue('pollTimer')), max: parseInt(interaction.fields.getTextInputValue('pollMaxChoices')) }, this.client);
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