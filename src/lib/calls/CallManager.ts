import { getIdFromMention } from "#helpers/discord";
import { Call } from "#lib/calls/Call";
import type { PrismClient } from "#lib/PrismClient";
import { ButtonInteraction, Collection, Guild, Snowflake, VoiceChannel } from "discord.js";

export class CallManager extends Collection<Snowflake, Call> {
    constructor(client: PrismClient) {
        super();
        this.client = client;
    }

    /**
     * Initialises the Call Manager. Loading the active calls from the database.
     */
    public async init() {

        this.client.logger.info("Fetching active calls...");
        const data = await this.db.fetchCalls()

        for (const raw of data) {

            const call = new Call(raw, this.client);

            try {
                this.set(call.channel.id, call);
            } catch {
                this.client.logger.error(`Error while adding call ${raw.call_id}`)
            }
        }

        this.client.logger.info("Calls fetched");
    }

    /**
     * Create's a call
     * @param {Guild} guild Guild the call is in
     * @param {User} user User who initiated the call
     * @param {VoiceChannel} channel VoiceChannel for the call
     * @returns {Call} The created call
     */
    public async create(guild: Guild, userId: Snowflake, channel: VoiceChannel) {
        const call = new Call(await this.db.createCall(guild, userId, channel), this.client);
        this.set(call.channel.id, call);
        return call;
    }

    public async recreate(interaction: ButtonInteraction, guild: Guild, channel: VoiceChannel) {
        const userId = getIdFromMention(interaction.message.embeds[0].fields[0].value);
        return this.create(guild, userId, channel);
    }

    private get db() {
        return this.client.db;
    }

}

export interface CallManager {
    client: PrismClient;
}