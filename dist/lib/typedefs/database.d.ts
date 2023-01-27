import type { Snowflake } from "discord.js";
export type RawDatabaseUser = {
    user_id: Snowflake;
};
export type RawDatabaseGuild = {
    guild_id: Snowflake;
    channel_id_counting: Snowflake;
    channel_id_levelup: Snowflake;
    channel_id_calls: Snowflake;
    counting_count: number;
    level_roles_stack: number;
};
export type RawDatabaseMember = {
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
    tracking_voice: number;
    counting_counts: number;
    counting_last_message_url: string | null;
    rps_wins: number;
    rps_losses: number;
    rps_draws: number;
};
export type RawDatabaseLevelRole = {
    level_role_id: number;
    guild_id: Snowflake;
    role_id: Snowflake;
    level: number;
};
export type RawDatabaseCall = {
    call_id: number;
    guild_id: Snowflake;
    user_id: Snowflake;
    channel_id: Snowflake;
    persistent: number;
};
export type RawDatabasePoll = {
    poll_id: number;
    user_id: Snowflake;
    message_url: string;
    end_timestamp: EpochTimeStamp;
    max_choices: number;
};
export type RawDatabaseVote = {
    poll_id: number;
    user_id: Snowflake;
    vote: number;
};
//# sourceMappingURL=database.d.ts.map