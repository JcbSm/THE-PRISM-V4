import { SapphireClient } from "@sapphire/framework";
import type { ClientOptions, Snowflake } from "discord.js";
import { DatabaseClient } from "#lib/DatabaseClient";
import { PrismClientUtil } from "#structs/PrismClientUtil";

export class PrismClient extends SapphireClient {
    constructor(options: ClientOptions) {

        super(options)

        this.db = new DatabaseClient(this);
        this.dev = process.env.DEV == 'true'
        this.util = new PrismClientUtil(this);
        this.devGuildId = '569556194612740115';
        this.ownerId = '227848397447626752'
    }
}

export interface PrismClient {
    db: DatabaseClient;
    dev: boolean;
    util: PrismClientUtil;
    devGuildId: Snowflake;
    ownerId: Snowflake;
}