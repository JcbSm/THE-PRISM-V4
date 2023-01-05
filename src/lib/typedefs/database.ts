import type { Snowflake } from "discord.js"

export type DatabaseUser = {
    user_id: Snowflake;
}

export type DatabaseGuild = {
    guild_id: Snowflake;
    channel_id_counting: Snowflake;
    channel_id_levelup: Snowflake;
    counting_count: number;
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
    }
}

export type DatabaseMember = {
    guild_id: Snowflake;
    user_id: Snowflake;
    member_id: number;
    xp: number;
    xp_messages: number;
    xp_last_message_at: number;
    xp_voice_minutes: number;
    total_messages: number;
    total_voice_minutes: number;
    total_muted_minutes: number;
    voice: boolean;
    counting_counts: number;
    counting_last_message_url: string | null;
}

export namespace DatabaseMember {
    export type Options = {
        counting_counts?: number | string;
        counting_last_message_url?: string | null;
    }
}