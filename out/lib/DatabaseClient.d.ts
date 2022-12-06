import type { Client } from '#lib/Client';
export interface DatabaseClient {
    client: Client;
}
export declare class DatabaseClient {
    constructor(client: Client);
    connect(): import("mysql").Connection;
}
//# sourceMappingURL=DatabaseClient.d.ts.map