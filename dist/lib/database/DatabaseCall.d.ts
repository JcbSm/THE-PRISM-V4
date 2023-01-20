import type { PrismClient } from "#lib/PrismClient";
import type { RawDatabaseCall } from "#types/database";
import type { Snowflake } from "discord.js";
export declare class DatabaseCall {
    constructor(data: RawDatabaseCall, client: PrismClient);
    fetchChannel(): Promise<import("discord.js").Channel | null>;
    fetchUser(): Promise<import("discord.js").User | null>;
    end(): Promise<boolean>;
}
export interface DatabaseCall {
    client: PrismClient;
    call_id: number;
    guild_id: Snowflake;
    user_id: Snowflake;
    channel_id: Snowflake;
    persistent: boolean;
    deleted: boolean;
}
//# sourceMappingURL=DatabaseCall.d.ts.map