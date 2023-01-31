import { alphabet } from "#helpers/emojis";
import { getPollResults, resultsCanvas } from "#helpers/polls";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { Events } from "@sapphire/framework";
import { AttachmentBuilder, EmbedBuilder, Interaction } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: Events.InteractionCreate
})

export class PollResultsListener extends PrismListener {
    public override async run(interaction: Interaction) {

        if (!interaction.isButton() || interaction.customId !== 'pollResults' ) return;

        await interaction.deferReply({ ephemeral: true });

        const { totalVotes, results, optionValues } = await getPollResults(this.db, interaction.message);

        await interaction.editReply({
            files: totalVotes > 0 ? [
                new AttachmentBuilder(resultsCanvas(optionValues, results), { name: 'data.png'})
            ] : [],
            embeds: [
                new EmbedBuilder()
                    .setTitle('Poll Results')
                    .setDescription(results.map((r, i) => `${alphabet[i]} : \`${r}\` votes`).join("\n"))
                    .setImage('attachment://data.png')
            ]
        })

    }
}