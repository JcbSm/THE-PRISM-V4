import { DatabaseGuild } from "#lib/typedefs/database";
import { PrismSubcommand } from "#structs/PrismSubcommand";
import { ApplyOptions } from "@sapphire/decorators";
import type { ChatInputCommand } from "@sapphire/framework";

@ApplyOptions<PrismSubcommand.Options>({
    subcommands: [
        { name: 'counting', chatInputRun: 'chatInputRunCounting' },
        { name: 'level-ups', chatInputRun: 'chatInputRunLevelUp' }
    ]
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
                                .setDescription('The channel to be used for counting.')))

                .addSubcommand((command) =>
                    
                    command //
                        .setName('level-ups')
                        .setDescription('Level up channel.')
                        .addChannelOption((option) =>
                            
                            option //
                                .setName('channel')
                                .setDescription('The channel where level-up messages will be sent'))),
                                
            {
                idHints: ['1053315950759379034']
            })
    }

    public async chatInputRunCounting(interaction: PrismSubcommand.ChatInputInteraction) {

        if (!interaction.guild)
            return;

        // Get Channel
        const channel = interaction.options.getChannel('channel');

        // Check channel exists
        if (!channel) {
            return interaction.reply({ content: 'An error occurred while fetching Channel.', ephemeral: true });
        }

        // Check channel type
        if (!(channel.type == 'GUILD_TEXT' || channel.type == 'GUILD_PUBLIC_THREAD' || channel.type == 'GUILD_PRIVATE_THREAD')) {
            return interaction.reply({ content: 'This channel is of the wrong type.', ephemeral: true });
        }

        // Set channel
        await this.db.setChannel(interaction.guild, DatabaseGuild.Channels.COUNTING, channel);

        // Get data
        const { counting_count, channel_id_counting} = await this.db.fetchGuild(interaction.guild);

        // Confirm
        interaction.reply({ content: `Set the \`${DatabaseGuild.Channels.COUNTING.toUpperCase()}\` channel ID to \`${channel_id_counting}\``, ephemeral: true });

        channel.send({ content: `${counting_count}` });

        return;

    }

    public async chatInputRunLevelUp(interaction: PrismSubcommand.ChatInputInteraction) {
        
        if (!interaction.guild)
            return;

        // Get Channel
        const channel = interaction.options.getChannel('channel');

        // Check channel exists
        if (!channel) {
            return interaction.reply({ content: 'An error occurred while fetching Channel.', ephemeral: true });
        }

        // Check channel type
        if (!(channel.type == 'GUILD_TEXT' || channel.type == 'GUILD_PUBLIC_THREAD' || channel.type == 'GUILD_PRIVATE_THREAD')) {
            return interaction.reply({ content: 'This channel is of the wrong type.', ephemeral: true });
        }

        // Set channel
        await this.db.setChannel(interaction.guild, DatabaseGuild.Channels.LEVEL_UP, channel);

        return interaction.reply({ content: `Set the \`${DatabaseGuild.Channels.LEVEL_UP.toUpperCase()}\` channel to ${channel}`, ephemeral: true });

    }
}