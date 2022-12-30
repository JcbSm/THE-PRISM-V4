import { SapphireClient } from "@sapphire/framework";
import type { ClientOptions, Snowflake } from "discord.js";
import { DatabaseClient } from "#lib/DatabaseClient";
import { PrismClientUtil } from "#structs/PrismClientUtil";
export declare class PrismClient extends SapphireClient {
    constructor(options: ClientOptions);
}
export interface PrismClient {
    db: DatabaseClient;
    dev: boolean;
    util: PrismClientUtil;
    devGuildId: Snowflake;
}
//# sourceMappingURL=PrismClient.d.ts.map