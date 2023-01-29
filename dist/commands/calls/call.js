import { __decorate } from "tslib";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { ChannelType, EmbedBuilder, GuildMember, PermissionFlagsBits } from "discord.js";
let CallComand = class CallComand extends PrismCommand {
    async registerApplicationCommands(registry) {
        registry.registerChatInputCommand(command => command //
            .setName(this.name)
            .setDescription(this.description)
            .addIntegerOption(option => option //
            .setName('userlimit')
            .setDescription('Number of users. Set to 0 for unlimited.')
            .setMinValue(0)
            .setMaxValue(99))
            .addStringOption(option => option //
            .setName('name')
            .setDescription('The name of the voice channel.')
            .setMaxLength(30)
            .setMinLength(1))
            .addBooleanOption(option => option //
            .setName('private')
            .setDescription('If the call should be private (invisible to @everyone).')));
    }
    async chatInputRun(interaction) {
        if (!interaction.guild || !(interaction.member instanceof GuildMember))
            return;
        const { channel_id_calls } = await this.db.fetchGuild(interaction.guild);
        if (!channel_id_calls)
            return interaction.reply({ ephemeral: true, content: 'No parent channel set, calls will be unavailable.' });
        const exists = await this.db.fetchMemberCall(interaction.member);
        if (exists)
            return interaction.reply({ ephemeral: true, content: 'You can only have one call per server.' });
        const priv = interaction.options.getBoolean('private', false) ?? false;
        await interaction.deferReply({ ephemeral: priv });
        const userLimit = interaction.options.getInteger('userlimit', false) ?? 0;
        const channelName = interaction.options.getString('name', false) ?? `${interaction.member.displayName}'s Channel`;
        const vc = await interaction.guild.channels.create({
            userLimit,
            name: channelName,
            type: ChannelType.GuildVoice,
            parent: channel_id_calls,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: ['ViewChannel']
                },
                {
                    id: this.client.user.id,
                    allow: ['ViewChannel']
                },
                {
                    id: interaction.guild.roles.everyone.id,
                    allow: priv ? [] : [PermissionFlagsBits.ViewChannel],
                    deny: priv ? [PermissionFlagsBits.ViewChannel] : []
                }
            ]
        });
        const call = await this.client.calls.create(interaction.guild, interaction.user.id, vc);
        const msg = await call.sendOptionsMessage();
        return msg
            ? await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Call created`)
                        .setDescription(' Click above to go to your text channel')
                        .setURL(msg.url)
                ]
            })
            : null;
    }
};
CallComand = __decorate([
    ApplyOptions({
        name: 'call',
        description: 'Create a temporary call'
    })
], CallComand);
export { CallComand };
//# sourceMappingURL=call.js.map