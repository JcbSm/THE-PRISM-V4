import type { RawDatabaseMember } from "#types/database";
import type { Snowflake } from "discord.js";
export declare class DatabaseMember {
    constructor(data: RawDatabaseMember);
}
export interface DatabaseMember {
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
    tracking_voice: boolean;
    counting_counts: number;
    counting_last_message_url: string | null;
}
export declare namespace DatabaseMember {
    type Options = {
        total_voice_minutes?: number | string;
        total_muted_minutes?: number | string;
        xp?: number | string;
        xp_voice_minutes?: number | string;
        tracking_voice?: boolean;
        counting_counts?: number | string;
        counting_last_message_url?: string | null;
    };
}
//# sourceMappingURL=DatabaseMember.d.ts.map