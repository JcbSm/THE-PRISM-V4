import { __decorate } from "tslib";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { AttachmentBuilder } from "discord.js";
let HandgrabCommand = class HandgrabCommand extends PrismCommand {
    registerApplicationCommands(reigistry) {
        reigistry.registerChatInputCommand(command => command //
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option => option //
            .setName('type')
            .setDescription('The type of handgrab to perform')
            .setChoices({ name: 'Default', value: 'default' }, { name: 'Thanos', value: 'thanos' }, { name: 'Laser eyes', value: 'laser' })));
    }
    async chatInputRun(interaction) {
        // const urls = this.getURLs(interaction.options.getString('type') ?? 'default');
        const attachments = this.getAttachment(interaction.options.getString('type') ?? 'default');
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
    getAttachment(type) {
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