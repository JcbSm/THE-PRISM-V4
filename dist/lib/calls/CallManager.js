import { getIdFromMention } from "#helpers/discord";
import { Call } from "#lib/calls/Call";
import { Collection } from "discord.js";
export class CallManager extends Collection {
    constructor(client) {
        super();
        this.client = client;
    }
    /**
     * Initialises the Call Manager. Loading the active calls from the database.
     */
    async init() {
        this.client.logger.info("Fetching active calls...");
        const data = await this.db.fetchCalls();
        for (const raw of data) {
            const call = new Call(raw, this.client);
            try {
                this.set(call.channel.id, call);
            }
            catch {
                this.client.logger.error(`Error while adding call ${raw.call_id}`);
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
    async create(guild, userId, channel) {
        const call = new Call(await this.db.createCall(guild, userId, channel), this.client);
        this.set(call.channel.id, call);
        return call;
    }
    async recreate(interaction, guild, channel) {
        const userId = getIdFromMention(interaction.message.embeds[0].fields[0].value);
        return this.create(guild, userId, channel);
    }
    get db() {
        return this.client.db;
    }
}
//# sourceMappingURL=CallManager.js.map