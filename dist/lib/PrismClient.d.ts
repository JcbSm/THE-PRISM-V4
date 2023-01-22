import { SapphireClient } from "@sapphire/framework";
import type { ClientOptions, Snowflake } from "discord.js";
import { DatabaseClient } from "#lib/database/DatabaseClient";
import { PrismClientUtil } from "#structs/PrismClientUtil";
import { CallManager } from "#lib/calls/CallManager";
export declare class PrismClient extends SapphireClient {
    constructor(options: ClientOptions);
}
export interface PrismClient {
    db: DatabaseClient;
    dev: boolean;
    calls: CallManager;
    util: PrismClientUtil;
    devGuildId: Snowflake;
    ownerId: Snowflake;
}
//# sourceMappingURL=PrismClient.d.ts.map