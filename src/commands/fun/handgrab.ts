import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { AttachmentBuilder } from "discord.js";

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

        // const urls = this.getURLs(interaction.options.getString('type') ?? 'default');
        const attachments = this.getAttachment(interaction.options.getString('type') ?? 'default');

        if (interaction.channel?.isTextBased()) {
            await interaction.reply({ content: `Laying the trap, don't say a word 🤫`, ephemeral: true });

            const top = await interaction.channel.send("\u200b");

            try {
                await interaction.channel.awaitMessages({ filter: m => !m.author.bot, max: 1, time: 1200 * 1000, errors: ['time']});
                await top.edit({ files: [ attachments.top ]});
                return await interaction.channel.send({ files: [attachments.bottom]});
            } catch (e) {

                console.error(e)

                return top.delete();
            }

        } else return;

    }

    private getAttachment(type: string): { top: AttachmentBuilder; bottom: AttachmentBuilder; } {

        const url = `./src/assets/handgrab/`
        const suffix = (type == 'default' ? "" : `_${type}`) + ".png" ;

        return {
            top: new AttachmentBuilder(url + "top" + suffix),
            bottom: new AttachmentBuilder(url + "bottom" + suffix)
        }
    }
}