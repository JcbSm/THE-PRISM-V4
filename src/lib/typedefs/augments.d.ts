import type { PrismClient } from "#lib/PrismClient";
import type { DatabaseClient } from "#lib/DatabaseClient";

declare module 'discord.js' {
    interface Client {
        db: DatabaseClient;
        dev: boolean;
    }
}

declare module '@sapphire/framework' {

    interface Command {
        client: PrismClient
        db: DatabaseClient;
    }

}