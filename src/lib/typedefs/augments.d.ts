import type { PrismClient } from "#lib/PrismClient";
import type { DatabaseClient } from "#lib/database/DatabaseClient";
import type { PrismClientUtil } from "#structs/PrismClientUtil";
import type { Snowflake } from "discord.js";
import type { CallManager } from "#lib/calls/CallManager";

declare module 'discord.js' {
    interface Client {
        db: DatabaseClient;
        dev: boolean;
        util: PrismClientUtil
        calls: CallManager;
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