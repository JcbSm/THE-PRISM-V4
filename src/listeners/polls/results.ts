import { alphabet } from "#helpers/emojis";
import { pad } from "#helpers/numbers";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { Events } from "@sapphire/framework";
import { EmbedBuilder, Interaction } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: Events.InteractionCreate
})

export class PollResultsListener extends PrismListener {
    public override async run(interaction: Interaction) {

        if (!interaction.isButton() || interaction.customId !== 'pollResults' ) return;

        const { poll_id } = await this.db.fetchPoll(interaction.message);
        const options = interaction.message.embeds[0].description?.split("\n") || [];
        //const optionValues = options.map(s => s.slice(5))

        const votes = (await this.db.fetchVotes(poll_id)).map(v => pad(v.vote.toString(2), options.length).split("").map(s => Number(s)).reverse());

        const results: number[] = new Array(options.length).fill(0);

        votes.forEach(v => {
            v.forEach((bit, i) => {
                results[i] += bit
            })
        })

        await interaction.reply({ ephemeral: true,
            embeds: [
                new EmbedBuilder()
                    .setTitle('Poll Results')
                    .setDescription(results.map((r, i) => `${alphabet[i]} : \`${r}\` votes`).join("\n"))
            ]
        })

    }
}