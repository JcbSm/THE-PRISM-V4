import type { Snowflake } from "discord.js";
export type User = {
    user_id: Snowflake;
};
export type Guild = {
    guild_id: Snowflake;
};
export type Member = {
    guild_id: Snowflake;
    user_id: Snowflake;
    member_id: number;
    xp: number;
    xp_messages: number;
    xp_voice_minuets: number;
    total_messages: number;
    total_voice_minutes: number;
    total_mute_minutes: number;
    voice: boolean;
    counting_counts: number;
    counting_last_message_url: string | null;
};
//# sourceMappingURL=database.d.ts.map