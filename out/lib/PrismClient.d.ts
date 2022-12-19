import { SapphireClient } from "@sapphire/framework";
import type { ClientOptions } from "discord.js";
import { DatabaseClient } from "#lib/DatabaseClient";
import { PrismClientUtil } from "./structures/PrismClientUtil";
export declare class PrismClient extends SapphireClient {
    constructor(options: ClientOptions);
}
export interface PrismClient {
    db: DatabaseClient;
    dev: boolean;
    util: PrismClientUtil;
}
//# sourceMappingURL=PrismClient.d.ts.map