import { __decorate } from "tslib";
import { blankFieldInline } from "#helpers/embeds";
import { groupDigits } from "#helpers/numbers";
import { card, levelCalc, requiredXP } from "#helpers/xp";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { MessageAttachment, MessageEmbed } from "discord.js";
let XpCommand = class XpCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder
            .setName('xp')
            .setDescription('Get xp.')
            .addUserOption((option) => option //
            .setName('user')
            .setDescription('User\'s xp to query')
            .setRequired(false)), {
            // [dev, prod]
            idHints: ['870364167645831189']
        });
    }
    async chatInputRun(interaction) {
        if (!interaction.guild)
            return;
        await interaction.deferReply();
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user ? user.id : interaction.user.id);
        const { xp, xp_messages, xp_voice_minutes } = await this.db.fetchMember(member);
        return await interaction.editReply({
            files: [
                new MessageAttachment(await card(member, this.client))
                    .setName('card.png')
            ], embeds: [
                new MessageEmbed()
                    .setImage('attachment://card.png')
                    .setFields([
                    {
                        name: 'TOTAL XP',
                        value: `\`${groupDigits(xp)}\``,
                        inline: true
                    },
                    blankFieldInline,
                    {
                        name: 'REMAINING XP',
                        value: `\`${groupDigits(requiredXP(levelCalc(xp) + 1) - xp)}\``,
                        inline: true
                    },
                    {
                        name: 'MESSAGES',
                        value: `\`${groupDigits(xp_messages)}\``,
                        inline: true
                    },
                    blankFieldInline,
                    {
                        name: 'VOICE',
                        value: `\`${groupDigits(xp_voice_minutes)} minutes\``,
                        inline: true
                    }
                ])
            ]
        });
    }
};
XpCommand = __decorate([
    ApplyOptions({})
], XpCommand);
export { XpCommand };
//# sourceMappingURL=xp.js.map