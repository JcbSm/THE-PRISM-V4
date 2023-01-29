import { __decorate } from "tslib";
import { alphabet } from "#helpers/emojis";
import { pad } from "#helpers/numbers";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import { Events } from "@sapphire/framework";
import { createCanvas, registerFont } from "canvas";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
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
        const totalVotes = results.reduce((c, a) => c + a);
        await interaction.reply({ ephemeral: true,
            files: totalVotes > 0 ? [
                new AttachmentBuilder(this.resultsCanvas(optionValues, results), { name: 'data.png' })
            ] : [],
            embeds: [
                new EmbedBuilder()
                    .setTitle('Poll Results')
                    .setDescription(results.map((r, i) => `${alphabet[i]} : \`${r}\` votes`).join("\n"))
                    .setImage('attachment://data.png')
            ]
        });
    }
    resultsCanvas(options, results) {
        const canvas = createCanvas(1920, 1080);
        const ctx = canvas.getContext('2d');
        const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'];
        const totalVotes = results.reduce((c, a) => c + a);
        const pieCenter = [canvas.width * .7, canvas.height / 2];
        registerFont('./src/assets/fonts/bahnschrift-main.ttf', { family: 'bahnschrift' });
        function truncateText(text, maxWidth) {
            let str = text;
            let trn = false;
            while (ctx.measureText(str).width > maxWidth) {
                trn = true;
                str = str.slice(0, -1);
            }
            if (trn)
                str = str.concat('...');
            return str;
        }
        function drawLabel(i) {
            const spacing = 50;
            const paddingY = 50 + (20 - options.length) * 25;
            const paddingX = 50;
            ctx.fillStyle = colors[i];
            ctx.fillRect(paddingX, paddingY + spacing * i, 20, 20);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '40px "bahnschrift"';
            const text = truncateText(`[${String.fromCharCode(65 + i)}]  ${options[i]}`, 600);
            ctx.fillText(text, paddingX * 2, paddingY + spacing * (i) + 20);
        }
        let currentAngle = 3 * Math.PI / 2;
        function drawSegment(center, i) {
            const radius = 500;
            //calculating the angle the slice (portion) will take in the chart
            let portionAngle = (results[i] / totalVotes) * 2 * Math.PI;
            //drawing an arc and a line to the center to differentiate the slice from the rest
            ctx.beginPath();
            ctx.arc(center[0], center[1], radius, currentAngle, currentAngle + portionAngle);
            currentAngle += portionAngle;
            ctx.lineTo(center[0], center[1]);
            //filling the slices with the corresponding mood's color
            ctx.fillStyle = colors[i];
            ctx.fill();
        }
        ctx.fillStyle = '#242424';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < options.length; i++) {
            // Label
            drawLabel(i);
            // Pie chart
            drawSegment(pieCenter, i);
        }
        return canvas.toBuffer();
    }
};
PollResultsListener = __decorate([
    ApplyOptions({
        event: Events.InteractionCreate
    })
], PollResultsListener);
export { PollResultsListener };
//# sourceMappingURL=results.js.map