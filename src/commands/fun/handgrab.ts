import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";

@ApplyOptions<PrismCommand.Options>({
    name: 'handgrab',
    description: 'Prank em wit a handgrab'
})

export class HandgrabCommand extends PrismCommand {
    public override registerApplicationCommands(reigistry: ApplicationCommandRegistry) {
        reigistry.registerChatInputCommand(command =>
            command //
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption(option =>
                    option //
                        .setName('type')
                        .setDescription('The type of handgrab to perform')
                        .setChoices(
                            { name: 'Default', value: 'default' },
                            { name: 'Thanos', value: 'thanos' },
                            { name: 'Laser eyes', value: 'laser' }
                        )))
    }

    public override async chatInputRun(interaction: PrismCommand.ChatInputInteraction) {

        const urls = this.getURLs(interaction.options.getString('type') ?? 'default');

        if (interaction.channel?.isTextBased()) {
            await interaction.reply({ content: `Laying the trap, don't say a word 🤫`, ephemeral: true });

            const top = await interaction.channel.send("\u200b");

            try {
                await interaction.channel.awaitMessages({ filter: m => !m.author.bot, max: 1, time: 1200 * 1000, errors: ['time']});
                await top.edit(urls.top);
                return await interaction.channel.send(urls.bot);
            } catch {
                return top.delete();
            }

        } else return;

    }

    private getURLs(type: string) {

        let top: string;
        let bot: string;

        if (type.toLowerCase() === 'thanos') {

            top = 'https://i.imgur.com/7kjMLYJ.png',
            bot = 'https://i.imgur.com/d5TxlJo.png'

        } else if (type.toLowerCase() === 'laser') {
            
            top = 'https://i.imgur.com/0S5zqIn.png',
            bot = 'https://i.imgur.com/iyyggjV.png'

        } else {
            top = 'https://i.imgur.com/Sv6kz8f.png',
            bot = 'https://i.imgur.com/wvUPp3d.png'
        };

        return { top, bot }

    }
}