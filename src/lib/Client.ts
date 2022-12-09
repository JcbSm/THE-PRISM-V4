import { SapphireClient } from "@sapphire/framework";
import type { ClientOptions } from "discord.js";
import { DatabaseClient } from "#lib/DatabaseClient";

export class PrismClient extends SapphireClient {
    constructor(options: ClientOptions) {
        super(options)
        this.db = new DatabaseClient(this);
    }
}

export interface PrismClient {
    db: DatabaseClient;
}