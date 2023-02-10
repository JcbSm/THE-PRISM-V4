import { __decorate } from "tslib";
import { parseDirname } from "#helpers/files";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { createCanvas, loadImage, registerFont } from "canvas";
import { AttachmentBuilder } from "discord.js";
import { resolve } from "path";
const dirname = parseDirname(import.meta.url);
let RibyCommand = class RibyCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        console.log(dirname);
        registry.registerChatInputCommand(command => command //
            .setName(this.name)
            .setDescription(this.description), {
            guildIds: this.client.dev ? [this.client.devGuildId] : dirname ? [dirname] : []
        });
    }
    async chatInputRun(interaction) {
        await interaction.deferReply();
        await interaction.editReply({ files: [
                new AttachmentBuilder(await this.drawRiby())
                    .setName('ribyquote.png')
            ] });
    }
    async drawRiby() {
        // Image URLs
        const images = [
            'https://cdn.discordapp.com/attachments/1014939283825643540/1052296710417829958/fortnite.jpg',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1052231794335952986/WIN_20221213_14_33_17_Pro.jpg',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1051657357396029471/rn_image_picker_lib_temp_71bb913b-e13d-425b-95c2-c6d28e1e66fb.jpg',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1043845115761938432/IMG_20221120_105603_447.jpg',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1042897921592541215/rn_image_picker_lib_temp_44527e5a-8b14-4267-930d-64e5d6c5a0cf.jpg',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1041862931891114095/IMG_20221111_195543_806.jpg',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1039214132769083532/IMG_20221107_161820.jpg',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1037772943540887613/rn_image_picker_lib_temp_5696cf8d-a9b6-4a8a-a87e-073892f88469.jpg',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1037054205963288608/rn_image_picker_lib_temp_2778b1f9-2a68-4320-9a35-3877a5eecd2a.jpg',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1032594368525258762/IMG_20221019_155807_026.jpg',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1022549987374141591/85C7439E-5DAC-4787-A615-61C8902DCC85.jpg',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1017839340686151730/IMG_4210.jpg',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1016446668788486204/CC060053-FDA7-4761-A70B-F6FB3330348B.JPG',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1016418623427973130/IMG_4153.png',
            'https://cdn.discordapp.com/attachments/1014939283825643540/1015269213730000997/2EA72597-4837-411F-85AF-44D78B4EA920.jpg',
        ];
        // Quotes
        const quotes = [
            // Just for testing: 
            // 'Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really Really long'
            'Can we get a example of the drake equation in haskell?',
            'Do you want some salami?',
            'Puss in boots 2 was very good.',
            'Mr Beast burger, right good.',
            'I got lost coming back from campus today.',
            'Bus.',
            'I\'m confused.'
        ];
        // Load IMPACT if running on host server (they too poor to have it)
        if (!this.client.dev)
            registerFont(resolve('./src/assets/fonts/impact.ttf'), { family: "Impact" });
        // Pick image and quote
        const imageURL = images[Math.floor(Math.random() * images.length)];
        const image = await loadImage(imageURL);
        const quote = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
        // Get width and height of image
        const { width, height } = (() => {
            let width = image.width;
            let height = image.height;
            // If too large, scale down by 5%
            while (width > 1000 || height > 1000) {
                width *= .95;
                height *= .95;
            }
            return { width, height };
        })();
        // Create the canvas to work with
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        // Set boundry for bottom text
        const bottomBoxHeight = height / 2.5;
        // Set default fontsize
        let fontsize = Math.round(height / 10);
        // Draw riby image
        ctx.drawImage(image, 0, 0, width, height);
        // Set default variables
        ctx.font = `${fontsize}px Impact`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = Math.round(fontsize / 10);
        // TITLE
        ctx.strokeText('RIBY QOTD:', width / 2, fontsize);
        ctx.fillText('RIBY QOTD:', width / 2, fontsize);
        // Function to split text into rows so it fits, as you can't write multilines
        const splitText = () => {
            // Init Variables
            const rows = [quote];
            let row = 0;
            // While the last row is too long to fit on the canvas
            // This will make new rows until all of them are small enough
            while (ctx.measureText(rows[rows.length - 1]).width > width) {
                // While the current row is too long to fit on the canvas
                while (ctx.measureText(rows[row]).width > width) {
                    // Move last word of current row to the start of the next
                    // if there is already a row, put it at the start
                    if (rows[row + 1])
                        rows[row + 1] = rows[row].split(" ").pop() + " " + rows[row + 1];
                    // Else if there isn't another row, make a new one
                    else
                        rows.push(rows[row].split(" ").pop() || '');
                    // Remove last word from current row
                    rows[row] = rows[row].split(" ").slice(0, -1).join(" ");
                }
                // next row
                row++;
            }
            return rows;
        };
        // Get the rows
        let rows = splitText();
        // If the rows are too tall, and go past our boundry
        while (rows.length * (fontsize + fontsize / 2) > bottomBoxHeight) {
            // Make font size slightly smaller
            fontsize -= 5;
            ctx.font = `${fontsize}px Impact`;
            // And get the rows again
            rows = splitText();
        }
        let spacing = fontsize + Math.round(fontsize / 10);
        ctx.lineWidth = Math.round(fontsize / 10);
        // Draw the text
        rows.forEach((str, i, arr) => {
            const rows = arr.length - 1;
            ctx.strokeText(str, width / 2, height - (ctx.lineWidth * 2 + (spacing * (rows - i))));
            ctx.fillText(str, width / 2, height - (ctx.lineWidth * 2 + (spacing * (rows - i))));
        });
        return canvas.toBuffer();
    }
};
RibyCommand = __decorate([
    ApplyOptions({
        name: 'ribyquote',
        description: 'Get one of Riby\'s amazing quotes',
    })
], RibyCommand);
export { RibyCommand };
//# sourceMappingURL=ribyquote.js.map