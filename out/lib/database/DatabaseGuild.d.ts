import type { Snowflake } from "discord.js";
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
    };
}
//# sourceMappingURL=DatabaseGuild.d.ts.map