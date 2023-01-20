import type { PrismClient } from "#lib/PrismClient";
import type { RawDatabaseCall } from "#types/database";
import type { Snowflake } from "discord.js";

export class DatabaseCall {
    constructor(data: RawDatabaseCall, client: PrismClient) {

        this.client = client;

        this.call_id = data.call_id;
        this.guild_id = data.guild_id;
        this.user_id = data.user_id;
        this.channel_id = data.channel_id;
        this.persistent = Boolean(data.persistent);
        this.deleted = false;
    }

    public async fetchChannel() {
        return this.deleted ? null : await this.client.channels.fetch(this.channel_id);
    }

    public async fetchUser() {
        return this.deleted ? null : await this.client.users.fetch(this.user_id);
    }

    public async end() {

        (await this.fetchChannel())?.delete();
        this.client.db.deleteCall(this.call_id);
        return this.deleted = true;

    }
}

export interface DatabaseCall {
    client: PrismClient;
    call_id: number;
    guild_id: Snowflake;
    user_id: Snowflake;
    channel_id: Snowflake;
    persistent: boolean;
    deleted: boolean;
}