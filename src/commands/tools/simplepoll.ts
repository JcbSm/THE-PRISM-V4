import { PrismCommand } from "#structs/PrismCommand";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { ApplicationCommandType, TextInputStyle } from "discord.js";

@ApplyOptions<PrismCommand.Options>({
    name: 'simplepoll',
    description: 'Create a reaction-based poll.'
})

export class SimplePollCommand extends PrismCommand {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(command =>
            command // 
                .setName(this.name)
                .setDescription(this.description))

        registry.registerContextMenuCommand(command =>
            command //
                .setName(this.description)
                .setType(ApplicationCommandType.Message))
    }

    public override async chatInputRun(interaction: PrismCommand.ChatInputInteraction) {

        return await interaction.showModal(this.getModal());
    }

    public override async contextMenuRun(interaction: PrismCommand.ContextMenuInteraction) {

        if (!interaction.isMessageContextMenuCommand()) return;

        return await interaction.showModal(this.getModal(interaction.targetMessage.content));
    }

    private getModal(question?: string) {
        return new ModalBuilder()
            .setCustomId('pollSimpleModal')
            .setTitle('Poll Options')
            .setComponents([
                new ActionRowBuilder<TextInputBuilder>()
                    .setComponents([
                        new TextInputBuilder()
                            .setCustomId('pollQuestion')
                            .setLabel('Question')
                            .setPlaceholder('What will you ask?')
                            .setValue(question ? question : '')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    ]),
                new ActionRowBuilder<TextInputBuilder>()
                    .setComponents([
                        new TextInputBuilder()
                            .setCustomId('pollOptions')
                            .setLabel('Options')
                            .setPlaceholder('Separate options with a new line (20 Max).\nYes\nNo\nMaybe...?')
                            .setStyle(TextInputStyle.Paragraph)
                            .setMaxLength(256)
                            .setRequired(true)
                        ])
            ])
    }
}