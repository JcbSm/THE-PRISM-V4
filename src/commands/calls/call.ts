import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, GuildMember } from "discord.js";

@ApplyOptions<PrismCommand.Options>({
    name: 'call',
    description: 'Create a temporary call'
})

export class CallComand extends PrismCommand {
    
    public override async registerApplicationCommands(registry: ApplicationCommandRegistry) {

        registry.registerChatInputCommand(command =>
            command //
                .setName(this.name)
                .setDescription(this.description)
                .addIntegerOption(option =>
                    option //
                        .setName('userlimit')
                        .setDescription('Number of users. Set to 0 for unlimited.')
                        .setMinValue(0)
                        .setMaxValue(99))
                .addStringOption(option =>
                    option //
                        .setName('name')
                        .setDescription('The name of the voice channel.')
                        .setMaxLength(20)
                        .setMinLength(1))
                .addBooleanOption(option =>
                    option //
                        .setName('private')
                        .setDescription('If the call should be private (invisible to @everyone).')))
    }

    public override async chatInputRun(interaction: PrismCommand.ChatInputInteraction) {

        if (!interaction.guild) return;

        const { channel_id_calls } = await this.db.fetchGuild(interaction.guild);

        if (!channel_id_calls) return interaction.reply({ ephemeral: true, content: 'No parent channel set, calls will be unavailable.' });

        await interaction.deferReply({ ephemeral: true });

        if (!(interaction.member) || !(interaction.member instanceof GuildMember)) return;

        const userLimit = interaction.options.getInteger('userlimit', false) ?? 0;
        const channelName = interaction.options.getString('name', false) ?? `${interaction.member.displayName}'s Channel`;
        const priv = interaction.options.getBoolean('private', false) ?? false;

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
                    id: this.client.user!.id,
                    allow: ['ViewChannel']
                },
                {
                    id: interaction.guild.roles.everyone.id,
                    allow: priv ? [] : ['ViewChannel'],
                    deny: priv ? ['ViewChannel'] : []
                }
            ]
        });

        await this.db.addCall(interaction.guild, interaction.user, vc);

        const msg = await vc.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Call Options')
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents([
                        new ButtonBuilder()
                            .setCustomId('callEnd')
                            .setLabel('END')
                            .setStyle(ButtonStyle.Danger)
                    ])
            ]
        });

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Call created`)
                    .setDescription(' Click above to go to your text channel')
                    .setURL(msg.url)
            ]
        })

    }

}