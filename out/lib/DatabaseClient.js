import { createConnection } from 'mysql';
export class DatabaseClient {
    constructor(client) {
        this.client = client;
    }
    connect() {
        return createConnection(process.env.DB_URL);
    }
}
