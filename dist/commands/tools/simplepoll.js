import { __decorate } from "tslib";
import { PrismCommand } from "#structs/PrismCommand";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandType, TextInputStyle } from "discord.js";
let SimplePollCommand = class SimplePollCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(command => command // 
            .setName(this.name)
            .setDescription(this.description));
        registry.registerContextMenuCommand(command => command //
            .setName(this.description)
            .setType(ApplicationCommandType.Message));
    }
    async chatInputRun(interaction) {
        return await interaction.showModal(this.getModal());
    }
    async contextMenuRun(interaction) {
        if (!interaction.isMessageContextMenuCommand())
            return;
        return await interaction.showModal(this.getModal(interaction.targetMessage.content));
    }
    getModal(question) {
        return new ModalBuilder()
            .setCustomId('pollSimpleModal')
            .setTitle('Poll Options')
            .setComponents([
            new ActionRowBuilder()
                .setComponents([
                new TextInputBuilder()
                    .setCustomId('pollQuestion')
                    .setLabel('Question')
                    .setPlaceholder('What will you ask?')
                    .setValue(question ? question : '')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ]),
            new ActionRowBuilder()
                .setComponents([
                new TextInputBuilder()
                    .setCustomId('pollOptions')
                    .setLabel('Options')
                    .setPlaceholder('Separate options with a new line (20 Max).\nYes\nNo\nMaybe...?')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(256)
                    .setRequired(true)
            ])
        ]);
    }
};
SimplePollCommand = __decorate([
    ApplyOptions({
        name: 'simplepoll',
        description: 'Create a reaction-based poll.'
    })
], SimplePollCommand);
export { SimplePollCommand };
//# sourceMappingURL=simplepoll.js.map