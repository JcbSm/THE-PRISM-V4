import { SapphireClient } from "@sapphire/framework";
import type { ClientOptions, Snowflake } from "discord.js";
import { DatabaseClient } from "#lib/DatabaseClient";
import { PrismClientUtil } from "#structs/PrismClientUtil";

export class PrismClient extends SapphireClient {
    constructor(options: ClientOptions) {

        super(options)

        this.db = new DatabaseClient(this);
        console.log(process.env.DEV);
        this.dev = Boolean(process.env.DEV);
        this.util = new PrismClientUtil(this);
        this.devGuildId = '569556194612740115';
    }
}

export interface PrismClient {
    db: DatabaseClient;
    dev: boolean;
    util: PrismClientUtil;
    devGuildId: Snowflake;
}