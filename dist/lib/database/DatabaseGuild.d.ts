import type { RawDatabaseGuild } from "#types/database";
import type { Snowflake } from "discord.js";
export declare class DatabaseGuild {
    constructor(data: RawDatabaseGuild);
}
export interface DatabaseGuild {
    guild_id: Snowflake;
    channel_id_counting: Snowflake | null;
    channel_id_levelup: Snowflake | null;
    channel_id_calls: Snowflake | null;
    counting_count: number;
    level_roles_stack: Boolean;
}
export declare namespace DatabaseGuild {
    enum Channels {
        COUNTING = "counting",
        LEVEL_UP = "levelup",
        CALLS = "calls"
    }
    type Options = {
        channel_id_counting?: Snowflake;
        channel_id_levelup?: Snowflake;
        channel_id_calls?: Snowflake;
        counting_count?: number;
        level_roles_stack?: boolean;
    };
}
//# sourceMappingURL=DatabaseGuild.d.ts.map