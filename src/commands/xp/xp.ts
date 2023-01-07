import { blankFieldInline } from "#helpers/embeds";
import { groupDigits } from "#helpers/numbers";
import { card, getLevel, getRequiredXP } from "#helpers/xp";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators"
import type { ChatInputCommand } from "@sapphire/framework";
import { GuildMember, MessageAttachment, MessageEmbed } from "discord.js";

@ApplyOptions<PrismCommand.Options>({
    name: 'xp',
    description: 'Get XP'
})

export class XpCommand extends PrismCommand {

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand(
            (builder) => builder
                .setName(this.name)
                .setDescription(this.description)
                .addUserOption((option) =>
                    option //
                        .setName('user')
                        .setDescription('User\'s xp to query')
                        .setRequired(false)),
            {
                // [dev, prod]
                idHints: ['870364167645831189']
            });

        registry.registerContextMenuCommand((builder) =>
            builder //
                .setName(this.description)
                .setType(2),
            {
                idHints: ['1061034487384899584']
            })
    }

    public async chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<unknown> {

        if (!interaction.guild)
            return;

        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user ? user.id : interaction.user.id);

        return this.reply(member, interaction);

    }

    public async contextMenuRun(interaction: PrismCommand.ContextMenuInteraction) {

        if (!interaction.guild)
            return;

        if (interaction.isUserContextMenu() && interaction.targetMember instanceof GuildMember) {
            const member = interaction.targetMember;
            
            this.reply(member, interaction, true);

        }
    }

    private async reply(member: GuildMember, interaction: PrismCommand.ChatInputInteraction | PrismCommand.ContextMenuInteraction, ephemeral = false) {

        const { xp, xp_messages, xp_voice_minutes } = await this.db.fetchMember(member);

        return await interaction.reply({ ephemeral, 
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
                            value: `\`${groupDigits(getRequiredXP(getLevel(xp)+1) - xp)}\``,
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
        })
    }
}