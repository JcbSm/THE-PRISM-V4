import { __decorate } from "tslib";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
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
        const urls = this.getURLs(interaction.options.getString('type') ?? 'default');
        if (interaction.channel?.isTextBased()) {
            await interaction.reply({ content: `Laying the trap, don't say a word 🤫`, ephemeral: true });
            const top = await interaction.channel.send("\u200b");
            try {
                await interaction.channel.awaitMessages({ filter: m => !m.author.bot, max: 1, time: 1200 * 1000, errors: ['time'] });
                await top.edit(urls.top);
                return await interaction.channel.send(urls.bot);
            }
            catch {
                return top.delete();
            }
        }
        else
            return;
    }
    getURLs(type) {
        let top;
        let bot;
        if (type.toLowerCase() === 'thanos') {
            top = 'https://i.imgur.com/7kjMLYJ.png',
                bot = 'https://i.imgur.com/d5TxlJo.png';
        }
        else if (type.toLowerCase() === 'laser') {
            top = 'https://i.imgur.com/0S5zqIn.png',
                bot = 'https://i.imgur.com/iyyggjV.png';
        }
        else {
            top = 'https://i.imgur.com/Sv6kz8f.png',
                bot = 'https://i.imgur.com/wvUPp3d.png';
        }
        ;
        return { top, bot };
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