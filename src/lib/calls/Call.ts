import { isChannelPublic } from "#helpers/discord";
import { blankFieldInline } from "#helpers/embeds";
import type { PrismClient } from "#lib/PrismClient";
import type { RawDatabaseCall } from "#types/database";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, Guild, OverwriteType, PermissionFlagsBits, PermissionOverwrites, Snowflake, User, VoiceChannel } from "discord.js";

export class Call {

    private channel_id;
    private user: User | undefined;

    constructor(data: RawDatabaseCall, client: PrismClient) {
        this.client = client;
        this.id = data.call_id;
        this.userId = data.user_id;
        this.persistent = Boolean(data.persistent);
        this.deleted = false;
        this.channel_id = data.channel_id;
        this.getChannel();
    }

    public get guild() {
        return this.channel.guild;
    }

    public get isPublic() {
        return isChannelPublic(this.channel)
    }

    public get userLimit() {
        return this.channel.userLimit;
    }

    /**
     * Fetch voice channel
     * @returns {VoiceChannel | null} The channel, if there is one.
     */
    public getChannel(): VoiceChannel | void {

        if (this.channel)
            return this.channel;

        try {

            const channel = this.client.channels.cache.get(this.channel_id);
            
            if (!channel) {
                this.end();
                throw 'No channel found'
            }

            if (channel.type !== ChannelType.GuildVoice) {
                this.end();
                throw "channel is wrong type"
            }

            return this.channel = channel;

        } catch (err) {
            this.end();
        }
    }

    /**
     * Fetch the call owner
     * @returns {User} Discord user
     */
    public async fetchOwner() {

        if (this.user)
            return this.user;

        return this.user = await this.client.users.fetch(this.userId);
    }

    /**
     * Send the options message on initialisation.
     * @returns {Message} The send message
     */
    public async sendOptionsMessage() {

        const channel = this.getChannel();

        const msg = await channel?.send({
            embeds: [ await this.getOptionsEmbed() ],
            components: this.getOptionsComponents()
        });

        return msg;
    }

    /**
     * Ends a call, deleting the channel and the database entry
     * @returns {void} call#deleted
     */
    public async end() {
        this.channel?.delete();
        this.client.db.deleteCall(this.id);
        this.deleted = true;
    }

    /**
     * Toggles the visibility of the voice channel for @everyone
     * @returns {boolean} New permission value
     */
    public async toggleVisibility() {
        const priv = !this.isPublic;
        await this.channel.permissionOverwrites.edit(this.guild.roles.everyone.id, { ViewChannel: priv })
        return priv
    }

    public async fetchUserIds() {

        return this.channel.permissionOverwrites.cache.filter((overwrite: PermissionOverwrites) => {
            return overwrite.type == OverwriteType.Member && overwrite.allow.has('ViewChannel') && overwrite.id != this.client.id && overwrite.id != this.userId;
        }).map((_, id: Snowflake) => id);

    }

    public async setUsers(ids: Snowflake[]) {

        const visibility = this.isPublic;

        this.channel.permissionOverwrites.set([
            {
                id: this.guild.roles.everyone,
                allow: visibility ? [PermissionFlagsBits.ViewChannel] : [],
                deny: visibility ? [] : [PermissionFlagsBits.ViewChannel]
            },
            {
                id: this.userId,
                allow: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: this.client.user!.id,
                allow: [PermissionFlagsBits.ViewChannel]
            },
            ...ids.map((userId: Snowflake) => {
                return {
                    id: userId,
                    allow: [PermissionFlagsBits.ViewChannel]
                }
            })
        ])

    }

    public async addUser(id: Snowflake) {

        this.channel.permissionOverwrites.edit(id, { ViewChannel: true });

    }

    public async removeUser(id: Snowflake) {
        this.channel.permissionOverwrites.delete(id);
    }

    /**
     * Update call voice channel user limit
     * @param {number} n The new user limit
     * @returns The channel
     */
    public async setUserLimit(n: number) {
        if (n < 0 || n > 99) throw 'User limit out of range';
        return await this.channel.setUserLimit(n)
    }

    /**
     * Get the Options Embed
     * @returns {EmbedBuilder} Embed
     */
    public async getOptionsEmbed() {
        return new EmbedBuilder()
            .setTitle('Call Options')
            .setDescription('Configure your call here.')
            .addFields([
                { name: 'Created By', value: `${await this.fetchOwner()}`, inline: true },
                blankFieldInline,
                { name: 'Visibility', value: this.isPublic ? '🔓 Public' : '🔒 Private', inline: true},
                { name: 'User Limit', value: `\`${this.userLimit > 0 ? this.userLimit : '0 (unlimited)' }\``, inline: true }
            ])
    }

    private getOptionsComponents() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents([
                    new ButtonBuilder()
                        .setCustomId('callEnd')
                        .setLabel('End')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('callToggleVisibility')
                        .setLabel('Toggle Visibility')
                        .setStyle(ButtonStyle.Secondary)
                ]),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents([
                    new ButtonBuilder()
                        .setCustomId('callIncUserLimit')
                        .setLabel('(1) user limit')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('➕')
                        .setDisabled(this.userLimit == 99 ? true : false),
                    new ButtonBuilder()
                        .setCustomId('callDecUserLimit')
                        .setLabel('(1) user limit')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('➖')
                        .setDisabled(this.userLimit == 0 ? true : false)
                ]),
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents([
                        new ButtonBuilder()
                            .setCustomId('callManageUsers')
                            .setLabel('Manage Users')
                            .setStyle(ButtonStyle.Success)
                        ])
        ]
    }
}

export interface Call {
    client: PrismClient;
    guild: Guild;
    userId: Snowflake;
    id: number;
    channel: VoiceChannel;
    persistent: boolean;
    deleted: boolean;
}