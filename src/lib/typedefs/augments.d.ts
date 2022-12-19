import type { PrismClient } from "#lib/PrismClient";
import type { DatabaseClient } from "#lib/DatabaseClient";
import type { PrismClientUtil } from "#lib/util/PrismClientUtil";

declare module 'discord.js' {
    interface Client {
        db: DatabaseClient;
        dev: boolean;
        util: PrismClientUtil
    }
}

declare module '@sapphire/framework' {

    interface Command {
        client: PrismClient
        db: DatabaseClient;
    }

}