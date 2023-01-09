import { groupDigits } from "#helpers/numbers";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators"
import type { ChatInputCommand } from "@sapphire/framework";
import { EmbedBuilder } from "discord.js";

@ApplyOptions<PrismCommand.Options>({

})

export class StatCommand extends PrismCommand {

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand(
            (builder) => builder
                .setName('stats')
                .setDescription('Get stats.')
                .addUserOption((option) =>
                    option //
                        .setName('user')
                        .setDescription('User\'s stats to query')
                        .setRequired(false)));
    }

    public async chatInputRun(interaction: PrismCommand.ChatInputInteraction): Promise<unknown> {

        if (!interaction.guild)
            return;

        await interaction.deferReply();

        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user ? user.id : interaction.user.id);
        
        const { 
            total_messages,
            total_voice_minutes,
            total_muted_minutes
        } = await this.db.fetchMember(member);

        return await interaction.editReply({ embeds: [ 
            new EmbedBuilder()
                .setThumbnail(member.displayAvatarURL({ size: 128 }))
                .setFields([
                    {
                        name: 'MESSAGES',
                        value: `\`${groupDigits(total_messages)}\``,
                        inline: true
                    },
                    // blankFieldInline,
                    {
                        name: 'VOICE',
                        value: `\`${groupDigits(total_voice_minutes)} minutes\``,
                        inline: true
                    },
                    // blankFieldInline,
                    {
                        name: 'MUTED',
                        value: `\`${groupDigits(total_muted_minutes)} minutes\``,
                        inline: true
                    }
                ])
            ]
        })
    }
}