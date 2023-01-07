import { Connection, MysqlError, OkPacket, Pool } from 'mysql';
import type { PrismClient } from '#lib/PrismClient';
import type { Channel, Guild, GuildMember, User } from 'discord.js';
import type { RawDatabaseUser, RawDatabaseGuild } from '#types/database';
import { DatabaseMember } from '#lib/database/DatabaseMember';
import type { DatabaseGuild } from '#lib/database/DatabaseGuild';
export interface DatabaseClient {
    client: PrismClient;
    pool: Pool;
    connection: Connection;
    db: DatabaseClient;
}
export declare class DatabaseClient {
    constructor(client: PrismClient);
    /**
     * Run a query on the MySQL database
     * @param query Query to be ran
     * @returns Query result
     */
    private query;
    /**
     * Converts options object into string useable with query
     * @param options Options to convert
     * @returns Queryable string eg. 'col = val, col = val'
     */
    private queryOptions;
    /**
     * Get a user from the database. Will insert user if none found.
     * @param user User to fetch
     * @returns User data
     */
    fetchUser(user: User): Promise<RawDatabaseUser>;
    /**
     * Get a guild from the database. Will insert guild if none found.
     * @param guild Guild to fetch
     * @returns Guild data
     */
    fetchGuild(guild: Guild): Promise<RawDatabaseGuild>;
    /**
     * Get member data. Will insert if none found
     * @param member GuildMember to fetch
     * @returns Member data
     */
    fetchMember(member: GuildMember): Promise<DatabaseMember>;
    /**
     * Fetch all database members
     * @returns {DatabaseMember[]} Every member in the database
     */
    fetchMembers(): Promise<DatabaseMember[]>;
    /**
     * Fetch all DatabaseMembers for a guild
     * @param {Guild} guild Guild to fetch for
     * @returns {Promise<DatabaseMember[]>} DatabaseMember array
     */
    fetchGuildMembers(guild: Guild): Promise<DatabaseMember[]>;
    /**
     * Fetch all database members where tracking_voice = true
     * @returns {DatabaseMember[]} Every member in the database where tracking_voice = true
     */
    fetchVoiceMembers(): Promise<DatabaseMember[]>;
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
     * Sets a channel in the guilds table
     * @param guild Guild to set channel for
     * @param feature Which channel id to set
     * @param channel ID of channel
     * @returns Query result
     */
    setChannel(guild: Guild, feature: DatabaseGuild.Channels, channel: Channel): Promise<OkPacket | MysqlError>;
    /**
     * Record a message for a guildmember.
     * @param member_id Database member ID from table_members
     * @param xp if the user should earn xp from this message
     * @returns
     */
    message(member_id: number, xp?: boolean): Promise<any>;
    trackVoice(member: GuildMember): Promise<void>;
}
//# sourceMappingURL=DatabaseClient.d.ts.map