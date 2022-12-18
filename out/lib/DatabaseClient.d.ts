import { Connection, MysqlError, OkPacket } from 'mysql';
import type { PrismClient } from '#lib/Client';
import type { Channel, Guild, GuildMember, User } from 'discord.js';
import type { DatabaseUser, DatabaseGuild, DatabaseMember } from './typedefs/database';
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
    /**
     * Update database values for a guild.
     * @param guild DatabaseGuild to update
     * @param options Fields to update
     * @returns MySQL Query result
     */
    updateGuild(guild: Guild, options: DatabaseGuild.Options): Promise<any>;
    /**
     * Update database values for member.
     * @param member Guildmember to update
     * @param options Fields to update
     * @returns MySQL query results
     */
    updateMember(member: GuildMember, options: DatabaseMember.Options): Promise<any>;
    /**
     * XP FUNCTIONS
     */
    addXP(member: DatabaseMember): Promise<void>;
    /**
     * Sets a channel in the guilds table
     * @param guild Guild to set channel for
     * @param feature Which channel id to set
     * @param channel ID of channel
     * @returns Query result
     */
    setChannel(guild: Guild, feature: DatabaseGuild.Channels, channel: Channel): Promise<OkPacket | MysqlError>;
    private queryOptions;
}
//# sourceMappingURL=DatabaseClient.d.ts.map