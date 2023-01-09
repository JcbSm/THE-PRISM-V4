import { __decorate } from "tslib";
import { groupDigits } from "#helpers/numbers";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandType, EmbedBuilder, GuildMember } from "discord.js";
let StatCommand = class StatCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption((option) => option //
            .setName('user')
            .setDescription('User\'s stats to query')
            .setRequired(false)));
        registry.registerContextMenuCommand(builder => builder //
            .setName(this.description)
            .setType(ApplicationCommandType.User));
    }
    async chatInputRun(interaction) {
        if (!interaction.guild)
            return;
        const user = interaction.options.getUser('user') ?? interaction.user;
        const member = await interaction.guild.members.fetch(user);
        return this.reply(interaction, member);
    }
    async contextMenuRun(interaction) {
        if (!interaction.guild)
            return;
        if (interaction.isUserContextMenuCommand() && interaction.targetMember instanceof GuildMember) {
            return this.reply(interaction, interaction.targetMember, true);
        }
        return;
    }
    async reply(interaction, member, ephemeral = false) {
        const { total_messages: messages, total_voice_minutes: voice_minutes, total_muted_minutes: muted_minutes } = await this.db.fetchMember(member);
        const { count, total_messages, total_voice_minutes, total_muted_minutes } = await this.db.sumUserMembers(member.user);
        return await interaction.reply({ ephemeral, embeds: [
                new EmbedBuilder()
                    .setTitle(`${member.displayName}'s Statistics`)
                    .setDescription(`${this.client.user} has \`${count}\` records of ${member}`)
                    .setThumbnail(member.displayAvatarURL({ size: 128 }))
                    .setFooter({ text: '(Global stats only include servers you share with the bot)' })
                    .setFields([
                    {
                        value: `__***${member.guild.name.toUpperCase()} STATS***__`,
                        name: '\u200b'
                    },
                    {
                        name: 'MESSAGES',
                        value: `\`${groupDigits(messages)}\``,
                        inline: true
                    },
                    {
                        name: 'VOICE',
                        value: `\`${groupDigits(voice_minutes)} minutes\``,
                        inline: true
                    },
                    {
                        name: 'MUTED',
                        value: `\`${groupDigits(muted_minutes)} minutes\``,
                        inline: true
                    },
                    {
                        value: '__***GLOBAL STATS***__',
                        name: '\u200b'
                    },
                    {
                        name: 'MESSAGES',
                        value: `\`${groupDigits(total_messages)}\``,
                        inline: true
                    },
                    {
                        name: 'VOICE',
                        value: `\`${groupDigits(total_voice_minutes)} minutes\``,
                        inline: true
                    },
                    {
                        name: 'MUTED',
                        value: `\`${groupDigits(total_muted_minutes)} minutes\``,
                        inline: true
                    }
                ])
            ]
        });
    }
};
StatCommand = __decorate([
    ApplyOptions({
        name: 'stats',
        description: 'View stats'
    })
], StatCommand);
export { StatCommand };
//# sourceMappingURL=stats.js.map