import { Call } from "#lib/calls/Call";
import type { PrismClient } from "#lib/PrismClient";
import { Collection, Guild, Snowflake, User, VoiceChannel } from "discord.js";

export class CallManager extends Collection<Snowflake, Call> {
    constructor(client: PrismClient) {
        super();
        this.client = client;
    }

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

    public async create(guild: Guild, user: User, channel: VoiceChannel) {
        const call = new Call(await this.db.createCall(guild, user, channel), this.client);
        this.set(call.channel.id, call);
        return call;
    }

    private get db() {
        return this.client.db;
    }

}

export interface CallManager {
    client: PrismClient;
}