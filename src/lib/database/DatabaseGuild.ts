import type { Snowflake } from "discord.js";

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
    }
}