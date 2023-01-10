import type { RawDatabaseGuild } from "#types/database";
import type { Snowflake } from "discord.js";
export declare class DatabaseGuild {
    constructor(data: RawDatabaseGuild);
}
export interface DatabaseGuild {
    guild_id: Snowflake;
    channel_id_counting: Snowflake;
    channel_id_levelup: Snowflake;
    counting_count: number;
    level_roles_stack: Boolean;
}
export declare namespace DatabaseGuild {
    type Channels = 'counting' | 'levelup';
    namespace Channels {
        const COUNTING = "counting";
        const LEVEL_UP = "levelup";
    }
    type Options = {
        channel_id_counting?: Snowflake;
        channel_id_levelup?: Snowflake;
        counting_count?: number;
        level_roles_stack?: boolean;
    };
}
//# sourceMappingURL=DatabaseGuild.d.ts.map