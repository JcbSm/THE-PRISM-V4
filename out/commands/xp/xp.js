import { __decorate } from "tslib";
import { blankFieldInline } from "#helpers/embeds";
import { groupDigits } from "#helpers/numbers";
import { card, getLevel, getRequiredTotalXp } from "#helpers/xp";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { GuildMember, AttachmentBuilder, EmbedBuilder, ApplicationCommandType } from "discord.js";
let XpCommand = class XpCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption((option) => option //
            .setName('user')
            .setDescription('User\'s xp to query')
            .setRequired(false)));
        registry.registerContextMenuCommand((builder) => builder //
            .setName(this.description)
            .setType(ApplicationCommandType.User));
    }
    async chatInputRun(interaction) {
        if (!interaction.guild)
            return;
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user ? user.id : interaction.user.id);
        return this.reply(member, interaction);
    }
    async contextMenuRun(interaction) {
        if (!interaction.guild)
            return;
        if (interaction.isUserContextMenuCommand() && interaction.targetMember instanceof GuildMember) {
            const member = interaction.targetMember;
            this.reply(member, interaction, true);
        }
    }
    async reply(member, interaction, ephemeral = false) {
        const { xp, xp_messages, xp_voice_minutes } = await this.db.fetchMember(member);
        return await interaction.reply({ ephemeral,
            files: [
                new AttachmentBuilder(await card(member, this.client))
                    .setName('card.png')
            ], embeds: [
                new EmbedBuilder()
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
                        value: `\`${groupDigits(getRequiredTotalXp(getLevel(xp) + 1) - xp)}\``,
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
    ApplyOptions({
        name: 'xp',
        description: 'View XP'
    })
], XpCommand);
export { XpCommand };
//# sourceMappingURL=xp.js.map