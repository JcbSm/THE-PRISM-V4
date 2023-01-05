import type { PrismClient } from "#lib/PrismClient";
import type { DatabaseClient } from "#lib/database/DatabaseClient";
import type { PrismClientUtil } from "#structs/PrismClientUtil";
import type { Snowflake } from "discord.js";

declare module 'discord.js' {
    interface Client {
        db: DatabaseClient;
        dev: boolean;
        util: PrismClientUtil
        devGuildId: Snowflake;
        ownerId: Snowflake;
    }
}

declare module '@sapphire/framework' {

    interface Command {
        client: PrismClient
        db: DatabaseClient;
    }

}