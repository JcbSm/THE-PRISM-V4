import { __decorate } from "tslib";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { ActionRowBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
let PollCommand = class PollCommand extends PrismCommand {
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
            .setCustomId('pollModal')
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
            ]),
            new ActionRowBuilder()
                .setComponents([
                new TextInputBuilder()
                    .setCustomId('pollTimer')
                    .setLabel('Duration')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
                    .setPlaceholder('Ex: 10 minutes | 4h | ...')
            ]),
            new ActionRowBuilder()
                .setComponents([
                new TextInputBuilder()
                    .setCustomId('pollMaxChoices')
                    .setLabel('Max Choices')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setValue('1')
                    .setMaxLength(2)
            ])
        ]);
    }
};
PollCommand = __decorate([
    ApplyOptions({
        name: 'poll',
        description: 'Create a poll'
    })
], PollCommand);
export { PollCommand };
//# sourceMappingURL=poll.js.map