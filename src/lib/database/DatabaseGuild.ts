import type { RawDatabaseGuild } from "#types/database";
import type { Snowflake } from "discord.js";

export class DatabaseGuild {
    constructor(data: RawDatabaseGuild) {
        this.guild_id = data.guild_id;
        this.channel_id_counting = data.channel_id_counting;
        this.channel_id_levelup = this.channel_id_levelup;
        this.counting_count = data.counting_count
        this.level_roles_stack = Boolean(data.level_roles_stack);
    }
}

export interface DatabaseGuild {
    guild_id: Snowflake;
    channel_id_counting: Snowflake;
    channel_id_levelup: Snowflake;
    counting_count: number;
    level_roles_stack: Boolean;
}

export namespace DatabaseGuild {

    export type Channels = 'counting' | 'levelup'

    export namespace Channels {
        export const COUNTING = 'counting';
        export const LEVEL_UP = 'levelup'
    }

    export type Options = {
        channel_id_counting?: Snowflake;
        channel_id_levelup?: Snowflake;
        counting_count?: number;
        level_roles_stack?: boolean;
    }
}