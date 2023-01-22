import { isChannelPublic } from "#helpers/discord";
import type { PrismClient } from "#lib/PrismClient";
import type { RawDatabaseCall } from "#types/database";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, Guild, User, VoiceChannel } from "discord.js";

export class Call {

    private channel_id;
    private user_id;

    constructor(data: RawDatabaseCall, client: PrismClient) {
        this.client = client;
        this.id = data.call_id;
        this.user_id = data.user_id;
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
    public async fetchUser() {

        if (this.user)
            return this.user;

        return this.user = await this.client.users.fetch(this.user_id);
    }

    /**
     * Send the options message on initialisation.
     * @returns {Message} The send message
     */
    public async sendOptionsMessage() {

        const channel = this.getChannel();

        const msg = await channel?.send({
            embeds: [ this.getOptionsEmbed() ],
            components: [ this.getOptionsComponents() ]
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

    public async toggleVisibility() {
        await this.channel.permissionOverwrites.edit(this.guild.roles.everyone.id, { ViewChannel: !this.isPublic })
        return !this.isPublic
    }

    private getOptionsEmbed() {
        return new EmbedBuilder()
            .setTitle('Call Options')
            .setDescription('Configure your call here.')
    }

    private getOptionsComponents() {
        return new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
                new ButtonBuilder()
                    .setCustomId('callEnd')
                    .setLabel('End')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('callToggleVisibility')
                    .setLabel('Toggle Visibility')
                    .setStyle(ButtonStyle.Primary)
            ])
    }
}

export interface Call {
    client: PrismClient;
    id: number;
    guild: Guild;
    user: User;
    channel: VoiceChannel;
    persistent: boolean;
    deleted: boolean;
}