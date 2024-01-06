import { __decorate } from "tslib";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { createCanvas, loadImage, registerFont } from "canvas";
import { AttachmentBuilder } from "discord.js";
let HandgrabCommand = class HandgrabCommand extends PrismCommand {
    registerApplicationCommands(reigistry) {
        reigistry.registerChatInputCommand(command => command //
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option => option //
            .setName('type')
            .setDescription('The type of handgrab to perform')
            .setChoices({ name: 'Default', value: 'default' }, { name: 'Thanos', value: 'thanos' }, { name: 'Laser eyes', value: 'laser' }))
            .addStringOption(option => option //
            .setName('text')
            .setDescription('The text to add to the top part of the handgrab.')
            .setMaxLength(128)));
    }
    async chatInputRun(interaction) {
        await registerFont('./src/assets/fonts/impact.ttf', { family: "impact" });
        const text = interaction.options.getString('text');
        const attachments = text
            ? await this.getAttachmentsText(interaction.options.getString('type') ?? 'default', text)
            : this.getAttachments(interaction.options.getString('type') ?? 'default');
        if (interaction.channel?.isTextBased()) {
            await interaction.reply({ content: `Laying the trap, don't say a word 🤫`, ephemeral: true });
            const top = await interaction.channel.send("\u200b");
            try {
                await interaction.channel.awaitMessages({ filter: m => !m.author.bot, max: 1, time: 1200 * 1000, errors: ['time'] });
                await top.edit({ files: [attachments.top] });
                return await interaction.channel.send({ files: [attachments.bottom] });
            }
            catch (e) {
                console.error(e);
                return top.delete();
            }
        }
        else
            return;
    }
    async getAttachmentsText(type, text) {
        const url = `./src/assets/handgrab/`;
        const suffix = (type == 'default' ? "" : `_${type}`) + ".png";
        const image = await loadImage(url + "top" + suffix);
        const textHeight = 200;
        const imageHeight = image.height + textHeight > 388 ? 388 : image.height + textHeight;
        const maxTextWidth = type == "thanos" ? 400 : image.width;
        const canvas = createCanvas(image.width, imageHeight);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, imageHeight - image.height);
        let fontSize;
        let lines = [[]];
        let line = 0;
        for (fontSize = 200; fontSize > 0; fontSize -= 5) {
            lines = [[]];
            line = 0;
            let xPos = 10;
            ctx.font = `${fontSize}px "impact"`;
            // for each word
            for (const word of text.split(" ")) {
                let width = ctx.measureText(word + " ").width;
                // If it fits on the current line
                if (xPos + width < maxTextWidth) {
                    lines[line].push(word);
                    xPos += width;
                    // If it doesnt
                }
                else {
                    // Next line
                    line++;
                    // Add new lines
                    lines[line] = [word];
                    xPos = width;
                }
            }
            if (lines.length * fontSize < textHeight)
                break;
        }
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = fontSize / 10;
        for (let i = 0; i < lines.length; i++) {
            ctx.strokeText(lines[i].join(" "), 10, fontSize * (i + 1));
            ctx.fillText(lines[i].join(" "), 10, fontSize * (i + 1));
        }
        return {
            top: new AttachmentBuilder(canvas.toBuffer()),
            bottom: new AttachmentBuilder(url + "bottom" + suffix)
        };
    }
    getAttachments(type) {
        const url = `./src/assets/handgrab/`;
        const suffix = (type == 'default' ? "" : `_${type}`) + ".png";
        return {
            top: new AttachmentBuilder(url + "top" + suffix),
            bottom: new AttachmentBuilder(url + "bottom" + suffix)
        };
    }
};
HandgrabCommand = __decorate([
    ApplyOptions({
        name: 'handgrab',
        description: 'Prank em wit a handgrab'
    })
], HandgrabCommand);
export { HandgrabCommand };
//# sourceMappingURL=handgrab.js.map