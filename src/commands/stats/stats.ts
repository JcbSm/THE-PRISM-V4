import { groupDigits } from "#helpers/numbers";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators"
import type { ChatInputCommand, ContextMenuCommand } from "@sapphire/framework";
import { ApplicationCommandType, EmbedBuilder, GuildMember } from "discord.js";

@ApplyOptions<PrismCommand.Options>({
    name: 'stats',
    description: 'View stats'
})

export class StatCommand extends PrismCommand {

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand(
            (builder) => builder
                .setName(this.name)
                .setDescription(this.description)
                .addUserOption((option) =>
                    option //
                        .setName('user')
                        .setDescription('User\'s stats to query')
                        .setRequired(false)))

        registry.registerContextMenuCommand(builder =>
            builder //
                .setName(this.description)
                .setType(ApplicationCommandType.User))
    }

    public async chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<unknown> {

        if (!interaction.guild)
            return;

        const user = interaction.options.getUser('user') ?? interaction.user;
        const member = await interaction.guild.members.fetch(user);
        
        return this.reply(interaction, member)
        
    }

    public async contextMenuRun(interaction: ContextMenuCommand.Interaction) {

        if(!interaction.guild)
            return;

        if (interaction.isUserContextMenuCommand() && interaction.targetMember instanceof GuildMember) {
            return this.reply(interaction, interaction.targetMember, true);
        }

        return;

    }

    private async reply(interaction: PrismCommand.ChatInputCommand | PrismCommand.ContextMenuInteraction, member: GuildMember, ephemeral = false) {

        const { 
            total_messages: messages,
            total_voice_minutes: voice_minutes,
            total_muted_minutes: muted_minutes
        } = await this.db.fetchMember(member);

        const {
            count,
            total_messages,
            total_voice_minutes,
            total_muted_minutes
        } = await this.db.sumUserMembers(member.user);

        let fields: { name: string, value: string, inline?: boolean }[] = [
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
            }
        ];

        if (count > 1)
            fields.push(...[                    
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

        return await interaction.reply({ ephemeral, embeds: [ 
            new EmbedBuilder()
                .setTitle(`${member.displayName}'s Statistics`)
                .setDescription(`${this.client.user} has \`${count}\` records of ${member}`)
                .setThumbnail(member.displayAvatarURL({ size: 128 }))
                .setFooter(count > 1 ? { text: '(Global stats only include servers you share with the bot)' } : null)
                .setFields(fields)
            ]
        })
    }
}