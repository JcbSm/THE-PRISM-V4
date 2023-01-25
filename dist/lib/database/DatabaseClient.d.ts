import { Connection, MysqlError, OkPacket, Pool } from 'mysql';
import type { PrismClient } from '#lib/PrismClient';
import type { Channel, Guild, GuildMember, Role, Snowflake, User, VoiceChannel } from 'discord.js';
import type { RawDatabaseUser, RawDatabaseLevelRole, RawDatabaseCall } from '#types/database';
import { DatabaseMember } from '#lib/database/DatabaseMember';
import { DatabaseGuild } from '#lib/database/DatabaseGuild';
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
     * Sums all the member data for a specified user
     * @param {User} user User to query for
     * @returns All the summations available in the DatabseMember class
     */
    sumUserMembers(user: User): Promise<{
        user_id: Snowflake;
        count: number;
        xp: number;
        xp_messages: number;
        xp_voice_minuets: number;
        total_messages: number;
        total_voice_minutes: number;
        total_muted_minutes: number;
        counting_counts: number;
    }>;
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
    setChannel(guild: Guild, feature: DatabaseGuild.Channels, channelId: Snowflake): Promise<OkPacket | MysqlError>;
    /**
     * Record a message for a guildmember.
     * @param member_id Database member ID from table_members
     * @param xp if the user should earn xp from this message
     * @returns
     */
    message(member_id: number, xp?: boolean): Promise<any>;
    /**
     * Tracks the voice stats for a member
     * @param {GuildMember} member Memebr to track
     */
    trackVoice(member: GuildMember): Promise<void>;
    addLevelRole(role: Role, guild: Guild, level: number): Promise<RawDatabaseLevelRole>;
    getLevelRoles(guild: Guild): Promise<RawDatabaseLevelRole[]>;
    removeLevelRole(id: number): Promise<any>;
    /**
     * Create a call
     * @param guild Guild
     * @param user User who created
     * @param channel The voice channel
     * @returns The created call
     */
    createCall(guild: Guild, userId: Snowflake, channel: VoiceChannel): Promise<RawDatabaseCall>;
    /**
     * Deletes a call
     * @param id Call id
     * @returns
     */
    deleteCall(id: number): Promise<any>;
    /**
     * Get a call from the database
     * @param channel Voice channel
     * @returns Call
     */
    fetchCall(channel: Channel): Promise<any>;
    fetchCalls(guild?: Guild): Promise<RawDatabaseCall[]>;
    rps(guild: Guild, user: User, opponent: User, outcome: number): Promise<void>;
}
//# sourceMappingURL=DatabaseClient.d.ts.map