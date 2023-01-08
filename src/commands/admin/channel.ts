import { PrismSubcommand } from "#structs/PrismSubcommand";
import { ApplyOptions } from "@sapphire/decorators";
import type { ChatInputCommand } from "@sapphire/framework";
import { DatabaseGuild } from "#lib/database/DatabaseGuild";
import { ChannelType, TextBasedChannel } from "discord.js";

@ApplyOptions<PrismSubcommand.Options>({
    subcommands: [
        { name: 'counting', chatInputRun: 'chatInputRunCounting' },
        { name: 'level-ups', chatInputRun: 'chatInputRunLevelUp' }
    ],
    preconditions: ['Administrator']
})

export class ChannelCommand extends PrismSubcommand {

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
                .setName('channel')
                .setDescription('Set a channel for a specific purpose.')

                .addSubcommand((command) =>

                    command //
                        .setName('counting')
                        .setDescription('Counting channel.')
                        .addChannelOption((option) =>

                            option //
                                .setName('channel')
                                .setDescription('The channel to be used for counting.')
                                .setRequired(true)))

                .addSubcommand((command) =>
                    
                    command //
                        .setName('level-ups')
                        .setDescription('Level up channel.')
                        .addChannelOption((option) =>
                            
                            option //
                                .setName('channel')
                                .setDescription('The channel where level-up messages will be sent')
                                .setRequired(true))),
                                
            {
                idHints: ['1053315950759379034', '1053835411002236989']
            })
    }

    public async chatInputRunCounting(interaction: PrismSubcommand.ChatInputCommandInteraction) {

        if (!interaction.guild)
            return;

        // Get Channel
        const channel = interaction.options.getChannel('channel', true) as TextBasedChannel;

        // Check channel type
        if (!(channel.type == ChannelType.GuildText || channel.type == ChannelType.PublicThread || channel.type == ChannelType.PrivateThread)) {
            return interaction.reply({ content: 'This channel is of the wrong type.', ephemeral: true });
        }

        // Set channel
        await this.db.setChannel(interaction.guild, DatabaseGuild.Channels.COUNTING, channel.id);

        // Get data
        const { counting_count, channel_id_counting} = await this.db.fetchGuild(interaction.guild);

        // Confirm
        interaction.reply({ content: `Set the \`${DatabaseGuild.Channels.COUNTING.toUpperCase()}\` channel ID to \`${channel_id_counting}\``, ephemeral: true });

        return channel.send({ content: `${counting_count}` });

    }

    public async chatInputRunLevelUp(interaction: PrismSubcommand.ChatInputCommandInteraction) {
        
        if (!interaction.guild)
            return;

        // Get Channel
        const channel = interaction.options.getChannel('channel', true) as TextBasedChannel;

        // Check channel type
        if (!(channel.type == ChannelType.GuildText || channel.type == ChannelType.PublicThread || channel.type == ChannelType.PrivateThread)) {
            return interaction.reply({ content: 'This channel is of the wrong type.', ephemeral: true });
        }

        // Set channel
        await this.db.setChannel(interaction.guild, DatabaseGuild.Channels.LEVEL_UP, channel.id);

        return interaction.reply({ content: `Set the \`${DatabaseGuild.Channels.LEVEL_UP.toUpperCase()}\` channel ID to \`${channel.id}\``, ephemeral: true });

    }
}