import { __decorate } from "tslib";
import { alphabet } from "#helpers/emojis";
import { getPollResults, resultsCanvas } from "#helpers/polls";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { Events } from "@sapphire/framework";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
let PollResultsListener = class PollResultsListener extends PrismListener {
    async run(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'pollResults')
            return;
        await interaction.deferReply({ ephemeral: true });
        const { totalVotes, results, optionValues } = await getPollResults(this.db, interaction.message);
        await interaction.editReply({
            files: totalVotes > 0 ? [
                new AttachmentBuilder(resultsCanvas(optionValues, results), { name: 'data.png' })
            ] : [],
            embeds: [
                new EmbedBuilder()
                    .setTitle('Poll Results')
                    .setDescription(results.map((r, i) => `${alphabet[i]} : \`${r}\` votes`).join("\n"))
                    .setImage('attachment://data.png')
            ]
        });
    }
};
PollResultsListener = __decorate([
    ApplyOptions({
        event: Events.InteractionCreate
    })
], PollResultsListener);
export { PollResultsListener };
//# sourceMappingURL=results.js.map