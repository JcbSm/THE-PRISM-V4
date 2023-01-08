import { __decorate } from "tslib";
import { PrismSubcommand } from "#structs/PrismSubcommand";
import { ApplyOptions } from "@sapphire/decorators";
import { DatabaseGuild } from "#lib/database/DatabaseGuild";
import { ChannelType } from "discord.js";
let ChannelCommand = class ChannelCommand extends PrismSubcommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder //
            .setName('channel')
            .setDescription('Set a channel for a specific purpose.')
            .addSubcommand((command) => command //
            .setName('counting')
            .setDescription('Counting channel.')
            .addChannelOption((option) => option //
            .setName('channel')
            .setDescription('The channel to be used for counting.')
            .setRequired(true)))
            .addSubcommand((command) => command //
            .setName('level-ups')
            .setDescription('Level up channel.')
            .addChannelOption((option) => option //
            .setName('channel')
            .setDescription('The channel where level-up messages will be sent')
            .setRequired(true))), {
            idHints: ['1053315950759379034', '1053835411002236989']
        });
    }
    async chatInputRunCounting(interaction) {
        if (!interaction.guild)
            return;
        // Get Channel
        const channel = interaction.options.getChannel('channel', true);
        // Check channel type
        if (!(channel.type == ChannelType.GuildText || channel.type == ChannelType.PublicThread || channel.type == ChannelType.PrivateThread)) {
            return interaction.reply({ content: 'This channel is of the wrong type.', ephemeral: true });
        }
        // Set channel
        await this.db.setChannel(interaction.guild, DatabaseGuild.Channels.COUNTING, channel.id);
        // Get data
        const { counting_count, channel_id_counting } = await this.db.fetchGuild(interaction.guild);
        // Confirm
        interaction.reply({ content: `Set the \`${DatabaseGuild.Channels.COUNTING.toUpperCase()}\` channel ID to \`${channel_id_counting}\``, ephemeral: true });
        return channel.send({ content: `${counting_count}` });
    }
    async chatInputRunLevelUp(interaction) {
        if (!interaction.guild)
            return;
        // Get Channel
        const channel = interaction.options.getChannel('channel', true);
        // Check channel type
        if (!(channel.type == ChannelType.GuildText || channel.type == ChannelType.PublicThread || channel.type == ChannelType.PrivateThread)) {
            return interaction.reply({ content: 'This channel is of the wrong type.', ephemeral: true });
        }
        // Set channel
        await this.db.setChannel(interaction.guild, DatabaseGuild.Channels.LEVEL_UP, channel.id);
        return interaction.reply({ content: `Set the \`${DatabaseGuild.Channels.LEVEL_UP.toUpperCase()}\` channel ID to \`${channel.id}\``, ephemeral: true });
    }
};
ChannelCommand = __decorate([
    ApplyOptions({
        subcommands: [
            { name: 'counting', chatInputRun: 'chatInputRunCounting' },
            { name: 'level-ups', chatInputRun: 'chatInputRunLevelUp' }
        ],
        preconditions: ['Administrator']
    })
], ChannelCommand);
export { ChannelCommand };
//# sourceMappingURL=channel.js.map