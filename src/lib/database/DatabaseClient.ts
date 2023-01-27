import { Connection, createPool, MysqlError, OkPacket, Pool } from 'mysql';
import type { PrismClient } from '#lib/PrismClient';
import type { Channel, Guild, GuildMember, Message, Role, Snowflake, User, VoiceChannel } from 'discord.js';
import type { 
    RawDatabaseUser,
    RawDatabaseGuild,
    RawDatabaseMember,
    RawDatabaseLevelRole,
    RawDatabaseCall,
    RawDatabasePoll,
    RawDatabaseVote,
} from '#types/database';
import { rng } from '#helpers/numbers';
import { DatabaseMember } from '#lib/database/DatabaseMember';
import { DatabaseGuild } from '#lib/database/DatabaseGuild';

export interface DatabaseClient {
    client: PrismClient;
    pool: Pool;
    connection: Connection;
    db: DatabaseClient;
}

export class DatabaseClient {
    constructor(client: PrismClient) {
        this.client = client;
        this.db = this.client.db;
        this.pool = createPool({
            connectionLimit: 10,
            host: process.env.DB_HOST,
            port: 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            supportBigNumbers: true,
        })
    }

    /**
     * Run a query on the MySQL database
     * @param query Query to be ran
     * @returns Query result
     */
    private async query(query: string, retries = 0): Promise<any> {

        const max_retries = 10
        
        const res = await new Promise((res, rej) => {
            this.pool.query({ sql: query, timeout: 10*1000 }, async (err, result) => {
                
                if (err) {

                    if (retries < max_retries) {
                    
                        console.log(`Query Error: ${err.code}. Retrying...`)
                        retries++;
                        await this.query(query, retries);
                        rej(err);
                    
                    } else {
                    
                        console.log(`Query failed after ${retries} retries`);
                        rej(err)
                    
                    }
                
                } else
                    res(result);

            })
        });

        return res;
    }

    /**
     * Converts options object into string useable with query
     * @param options Options to convert
     * @returns Queryable string eg. 'col = val, col = val'
     */
    private queryOptions(options: DatabaseGuild.Options | DatabaseMember.Options): string {
        const arr = Object.entries(options);
        return arr.map(v => `${v[0]} = ${v[1]}`).join(", ")
    }
    
    /**
     * Get a user from the database. Will insert user if none found.
     * @param user User to fetch
     * @returns User data
     */
    public async fetchUser(user: User): Promise<RawDatabaseUser> {
        return {...(await this.query(`SELECT * FROM users WHERE user_id = ${user.id};`))[0] || (await this.query(`INSERT INTO users (user_id) VALUES (${user.id}) RETURNING *`))[0]}
    }

    /**
     * Sums all the member data for a specified user
     * @param {User} user User to query for
     * @returns All the summations available in the DatabseMember class
     */
    public async sumUserMembers(user: User) {

        const query = `
            SELECT 
            user_id,
            COUNT(user_id) as count,
            SUM(xp) as xp,
            SUM(xp_messages) as xp_messages,
            SUM(xp_voice_minutes) as xp_voice_minutes,
            SUM(total_messages) as total_messages,
            SUM(total_voice_minutes) as total_voice_minutes,
            SUM(total_muted_minutes) as total_muted_minutes,
            SUM(counting_counts) as counting_counts
            FROM members WHERE user_id = ${user.id}
        `

        const data = (await this.query(query))[0] as {
            user_id: Snowflake;
            count: number;
            xp: number;
            xp_messages: number;
            xp_voice_minuets: number;
            total_messages: number;
            total_voice_minutes: number;
            total_muted_minutes: number;
            counting_counts: number;
        }

        return data;
    }

    /**
     * Get a guild from the database. Will insert guild if none found.
     * @param guild Guild to fetch
     * @returns Guild data
     */
    public async fetchGuild(guild: Guild): Promise<DatabaseGuild> {
        const data = {...(await this.query(`SELECT * FROM guilds WHERE guild_id = ${guild.id};`))[0] || (await this.query(`INSERT INTO guilds (guild_id) VALUES (${guild.id}) RETURNING *`))[0]} as RawDatabaseGuild;

        return new DatabaseGuild(data);
    }

    /**
     * Get member data. Will insert if none found
     * @param member GuildMember to fetch
     * @returns Member data
     */
    public async fetchMember(member: GuildMember): Promise<DatabaseMember> {

        // Ensure guild and member exist first.
        await this.fetchGuild(member.guild); await this.fetchUser(member.user);

        const data = {...(await this.query(`SELECT * FROM members WHERE user_id = ${member.user.id} AND guild_id = ${member.guild.id};`))[0] || //
            (await this.query(`INSERT INTO members (user_id, guild_id) VALUES (${member.user.id}, ${member.guild.id}) RETURNING *;`))[0]} as RawDatabaseMember;

        return new DatabaseMember(data);

    }

    /**
     * Fetch all database members
     * @returns {DatabaseMember[]} Every member in the database
     */
    public async fetchMembers(): Promise<DatabaseMember[]> {

        return (await this.query(`SELECT * FROM members`)).map((m: RawDatabaseMember) => new DatabaseMember(m));

    }

    /**
     * Fetch all DatabaseMembers for a guild
     * @param {Guild} guild Guild to fetch for
     * @returns {Promise<DatabaseMember[]>} DatabaseMember array
     */
    public async fetchGuildMembers(guild: Guild): Promise<DatabaseMember[]> {

        // Ensure guild exists.
        await this.fetchGuild(guild);

        const res = await this.query(`SELECT * FROM members WHERE guild_id = ${guild.id}`) as RawDatabaseMember[];

        return res.map(data => new DatabaseMember(data));
    }

    /**
     * Fetch all database members where tracking_voice = true
     * @returns {DatabaseMember[]} Every member in the database where tracking_voice = true
     */
    public async fetchVoiceMembers(): Promise<DatabaseMember[]> {

        const res = (await this.query(`SELECT * FROM members WHERE tracking_voice = true`)) as RawDatabaseMember[];

        return res.map(data => new DatabaseMember(data));

    }

    /**
     * Update database values for a guild.
     * @param guild DatabaseGuild to update
     * @param options Fields to update
     * @returns MySQL Query result
     */
    public async updateGuild(guild: Guild, options: DatabaseGuild.Options) {
        await this.fetchGuild(guild);
        return this.query(`UPDATE guilds SET ${this.queryOptions(options)} WHERE guild_id = ${guild.id}`)
    }

    /**
     * Update database values for member.
     * @param member Guildmember to update
     * @param options Fields to update
     * @returns MySQL query results
     */
    public async updateMember(member: GuildMember, options: DatabaseMember.Options) {
        const { member_id } = await this.fetchMember(member);
        return this.query(`UPDATE members SET ${this.queryOptions(options)} WHERE member_id = ${member_id}`)
    }

    /**
     * Sets a channel in the guilds table
     * @param guild Guild to set channel for
     * @param feature Which channel id to set
     * @param channel ID of channel
     * @returns Query result
     */
    public async setChannel(guild: Guild, feature: DatabaseGuild.Channels, channelId: Snowflake): Promise<OkPacket | MysqlError> {

        // Ensure guild exists on database
        await this.fetchGuild(guild);

        // Set values
        return await this.query(`UPDATE guilds SET channel_id_${feature} = ${channelId} WHERE guild_id = ${guild.id}`);
    }

    /**
     * Record a message for a guildmember.
     * @param member_id Database member ID from table_members
     * @param xp if the user should earn xp from this message
     * @returns 
     */
    public async message(member_id: number, xp = false) {

        const    query = `UPDATE members SET total_messages = total_messages + 1 WHERE member_id = ${member_id};`;
        const xp_query = `UPDATE members SET total_messages = total_messages + 1, xp = xp + ${rng(3, 7)}, xp_messages = xp_messages + 1, xp_last_message_at = ${Date.now()} WHERE member_id = ${member_id};`;

        return await this.query(xp ? xp_query : query);
    }

    /**
     * Tracks the voice stats for a member
     * @param {GuildMember} member Memebr to track
     */
    public async trackVoice(member: GuildMember) {

        this.client.logger.debug(`Tracking voice for ${member.user.tag} in ${member.guild.name}`)

        let i = 0;

        let interval = setInterval(async () => {

            i++;

            if (member.voice.channelId) {

                // If 5th minute and not defeaned and not alone
                if (i % 5 == 0 && (!member.voice.deaf && member.voice.channel!.members.filter(m => !m.user.bot).size > 1)) {
                    
                    this.client.logger.debug(`Adding xp to ${member.user.tag} in ${member.guild.name}`)
                    this.updateMember(member, {
                        total_voice_minutes: 'total_voice_minutes + 1',
                        total_muted_minutes: member.voice.mute ? 'total_muted_minutes + 1' : 'total_muted_minutes',
                        xp_voice_minutes: 'xp_voice_minutes + 5',
                        xp: 'xp + 5',
                        tracking_voice: true
                    })

                } else {

                    this.client.logger.debug(`Just incrememneting mnutes`);
                    this.updateMember(member, {
                        total_voice_minutes: 'total_voice_minutes + 1',
                        total_muted_minutes: member.voice.mute ? 'total_muted_minutes + 1' : 'total_muted_minutes',
                        tracking_voice: true,
                    })

                }

            } else {
                
                this.client.logger.debug(`Stopping voice tracking for ${member.user.tag} in ${member.guild.name}`)
                await this.updateMember(member, { tracking_voice: false });
                clearInterval(interval);
            }

        }, 60*1000);
    }

    public async addLevelRole(role: Role, guild: Guild, level: number): Promise<RawDatabaseLevelRole> {
        return (await this.query(`INSERT INTO level_roles (guild_id, role_id, level) VALUES (${guild.id}, ${role.id}, ${level}) RETURNING *`))[0];
    }

    public async getLevelRoles(guild: Guild): Promise<RawDatabaseLevelRole[]> {
        return await this.query(`SELECT * FROM level_roles WHERE guild_id = ${guild.id}`);
    }

    public async removeLevelRole(id: number) {
        return await this.query(`DELETE FROM level_roles WHERE level_role_id = ${id}`);        
    }

    /**
     * Create a call
     * @param guild Guild
     * @param user User who created
     * @param channel The voice channel
     * @returns The created call
     */
    public async createCall(guild: Guild, userId: Snowflake, channel: VoiceChannel): Promise<RawDatabaseCall> {
        return (await this.query(`INSERT INTO calls (guild_id, user_id, channel_id) VALUES (${guild.id}, ${userId}, ${channel.id}) RETURNING *`))[0];
    }

    /**
     * Deletes a call
     * @param id Call id
     * @returns 
     */
    public async deleteCall(id: number) {
        return await this.query(`DELETE FROM calls WHERE call_id = ${id}`);
    }

    /**
     * Get a call from the database
     * @param channel Voice channel
     * @returns Call
     */
    public async fetchCall(channel: Channel) {
        return (await this.query(`SELECT * FROM calls WHERE channel_id = ${channel.id}`))[0]
    }

    public async fetchCalls(guild?: Guild) {
        return guild 
            ? ((await this.query(`SELECT * FROM calls WHERE guild_id = ${guild.id}`)) as RawDatabaseCall[])
            : ((await this.query(`SELECT * FROM calls`)) as RawDatabaseCall[])
    }

    public async rps(guild: Guild, user: User, opponent: User, outcome: number) {
        const userfield = outcome > 0 ? 'wins' : outcome < 0 ? 'losses' : 'draws'
        const oponentfield = outcome < 0 ? 'wins' : outcome > 0 ? 'losses' : 'draws'
        this.query(`UPDATE members SET rps_${userfield} = rps_${userfield} + 1 WHERE user_id = ${user.id} AND guild_id = ${guild.id}`);
        this.query(`UPDATE members SET rps_${oponentfield} = rps_${oponentfield} + 1 WHERE user_id = ${opponent.id} AND guild_id = ${guild.id}`);
    }

    public async createPoll(message: Message, user: User, maxchoices: number, end: EpochTimeStamp | null): Promise<RawDatabasePoll> {
        return (await this.query(`INSERT INTO polls (message_url, user_id, end_timestamp, max_choices) VALUES ('${message.url}', ${user.id}, ${end}, ${maxchoices}) RETURNING *`))[0];
    }

    public async fetchPoll(message: Message): Promise<RawDatabasePoll> {
        return (await this.query(`SELECT * FROM polls WHERE message_url = '${message.url}'`))[0];
    }

    public async vote(pollId: number, user_id: Snowflake, vote: number) {
        return (await this.query(`REPLACE INTO poll_votes (poll_id, user_id, vote) VALUES (${pollId}, ${user_id}, ${vote})`))
    }

    public async fetchVotes(pollId: number): Promise<RawDatabaseVote[]> {
        return (await this.query(`SELECT * FROM poll_votes WHERE poll_id = ${pollId}`))
    }

    public async fetchActivePolls(): Promise<RawDatabasePoll[]> {
        return (await this.query(`SELECT * FROM polls WHERE end_timestamp > ${Date.now()}`))
    }
}