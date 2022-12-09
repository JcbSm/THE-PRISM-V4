import type { PrismClient } from "#lib/Client";
import type { DatabaseClient } from "#lib/DatabaseClient";

declare module 'discord.js' {
    interface Client {
        db: DatabaseClient;
    }
}

declare module '@sapphire/framework' {

    interface Command {
        client: PrismClient
        db: DatabaseClient;
    }

}