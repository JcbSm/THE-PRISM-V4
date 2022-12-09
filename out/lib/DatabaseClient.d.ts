import { Connection, MysqlError } from 'mysql';
import type { PrismClient } from '#lib/Client';
import type { Guild, GuildMember, User } from 'discord.js';
import type { User as DatabaseUser, Guild as DatabaseGuild, Member as DatabaseMember } from './typedefs/database';
export interface DatabaseClient {
    client: PrismClient;
    connection: Connection;
    db: DatabaseClient;
}
export declare class DatabaseClient {
    constructor(client: PrismClient);
    /**
     * Attempts to connect to the MySQL database.
     * @returns { Promise<Connection | MysqlError> } The established connection
     */
    connect(): Promise<Connection | MysqlError>;
    /**
     * Gets the Database URL from .env and creates the connection.
     * @returns { Connection } MySQL Connection.
     */
    private getConnection;
    /**
     * Run a query on the MySQL database
     * @param query Query to be ran
     * @returns Query result
     */
    private query;
    /**
     * Get a user from the database. Will insert user if none found.
     * @param user User to fetch
     * @returns User data
     */
    fetchUser(user: User): Promise<DatabaseUser>;
    /**
     * Get a guild from the database. Will insert guild if none found.
     * @param guild Guild to fetch
     * @returns Guild data
     */
    fetchGuild(guild: Guild): Promise<DatabaseGuild>;
    /**
     * Get member data. Will insert if none found
     * @param member GuildMember to fetch
     * @returns Member data
     */
    fetchMember(member: GuildMember): Promise<DatabaseMember>;
}
//# sourceMappingURL=DatabaseClient.d.ts.map