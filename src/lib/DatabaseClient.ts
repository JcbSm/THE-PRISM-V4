import { createConnection } from 'mysql';
import type { Client } from '#lib/Client';

export interface DatabaseClient {
    client: Client;
}

export class DatabaseClient {
    constructor(client: Client) {
        this.client = client;
    }

    public connect() {

        return createConnection(process.env.DB_URL!)

    }
}