import type { RawDatabaseGuild } from "#types/database";
import type { Snowflake } from "discord.js";

export class DatabaseGuild {
    constructor(data: RawDatabaseGuild) {
        this.guild_id = data.guild_id;
        this.channel_id_counting = data.channel_id_counting;
        this.channel_id_levelup = data.channel_id_levelup;
        this.channel_id_calls = data.channel_id_calls;
        this.counting_count = data.counting_count
        this.level_roles_stack = Boolean(data.level_roles_stack);
    }
}

export interface DatabaseGuild {
    guild_id: Snowflake;
    channel_id_counting: Snowflake | null;
    channel_id_levelup: Snowflake | null;
    channel_id_calls: Snowflake | null;
    counting_count: number;
    level_roles_stack: Boolean;
}

export namespace DatabaseGuild {

    export enum Channels {
        COUNTING = 'counting',
        LEVEL_UP = 'levelup',
        CALLS = 'calls'
    }

    export type Options = {
        channel_id_counting?: Snowflake;
        channel_id_levelup?: Snowflake;
        channel_id_calls?: Snowflake;
        counting_count?: number;
        level_roles_stack?: boolean;
    }
}