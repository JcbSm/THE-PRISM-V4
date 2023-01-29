import { alphabet } from "#helpers/emojis";
import { pad } from "#helpers/numbers";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { Events } from "@sapphire/framework";
import { createCanvas } from "canvas";
import { AttachmentBuilder, EmbedBuilder, Interaction } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: Events.InteractionCreate
})

export class PollResultsListener extends PrismListener {
    public override async run(interaction: Interaction) {

        if (!interaction.isButton() || interaction.customId !== 'pollResults' ) return;

        const { poll_id } = await this.db.fetchPoll(interaction.message);
        const options = interaction.message.embeds[0].description?.split("\n") || [];
        const optionValues = options.map(s => s.slice(5))

        const votes = (await this.db.fetchVotes(poll_id)).map(v => pad(v.vote.toString(2), options.length).split("").map(s => Number(s)).reverse());

        const results: number[] = new Array(options.length).fill(0);

        votes.forEach(v => {
            v.forEach((bit, i) => {
                results[i] += bit
            })
        })

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
        })

    }

    // private resultsCanvas(options: string[], results: number[]) {

    //     const canvas = createCanvas(1920, 1080);
    //     const ctx = canvas.getContext('2d');
    //     const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'];
    //     const totalVotes = results.reduce((c, a) => c + a);

    //     ctx.fillStyle = '#FFFFFF'
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);

    //     let angle = 0;

    //     for (let i = 0; i < options.length; i++) {

    //         // Label

    //         // Pie chart

    //     }

    //     return canvas.toBuffer();
    // }
}