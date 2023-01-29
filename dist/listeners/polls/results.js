import { __decorate } from "tslib";
import { alphabet } from "#helpers/emojis";
import { pad } from "#helpers/numbers";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { Events } from "@sapphire/framework";
import "canvas";
import { EmbedBuilder } from "discord.js";
let PollResultsListener = class PollResultsListener extends PrismListener {
    async run(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'pollResults')
            return;
        const { poll_id } = await this.db.fetchPoll(interaction.message);
        const options = interaction.message.embeds[0].description?.split("\n") || [];
        const optionValues = options.map(s => s.slice(5));
        const votes = (await this.db.fetchVotes(poll_id)).map(v => pad(v.vote.toString(2), options.length).split("").map(s => Number(s)).reverse());
        const results = new Array(options.length).fill(0);
        votes.forEach(v => {
            v.forEach((bit, i) => {
                results[i] += bit;
            });
        });
        await interaction.reply({ ephemeral: true,
            // files: [
            //     new AttachmentBuilder(this.resultsCanvas(optionValues, results), { name: 'data.png'})
            // ],
            embeds: [
                new EmbedBuilder()
                    .setTitle('Poll Results')
                    .setDescription(results.map((r, i) => `${alphabet[i]} : \`${r}\` votes`).join("\n"))
                //.setImage('attachment://data.png')
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