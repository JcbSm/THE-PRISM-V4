import type { PrismClient } from "#lib/PrismClient";
import type { DatabaseClient } from "#lib/DatabaseClient";
import type { PrismClientUtil } from "#structs/PrismClientUtil";
import type { Snowflake } from "discord.js";

declare module 'discord.js' {
    interface Client {
        db: DatabaseClient;
        dev: boolean;
        util: PrismClientUtil
        devGuildId: Snowflake;
    }
}

declare module '@sapphire/framework' {

    interface Command {
        client: PrismClient
        db: DatabaseClient;
    }

}