import { Connection, createPool, MysqlError, OkPacket, Pool } from 'mysql';
import type { PrismClient } from '#lib/PrismClient';
import type { Channel, Guild, GuildMember, User } from 'discord.js';
import type { 
    RawDatabaseUser,
    RawDatabaseGuild,
    RawDatabaseMember,
} from '#types/database';
import { rng } from '#helpers/numbers';
import { DatabaseMember } from '#lib/database/DatabaseMember';
import type { DatabaseGuild } from '#lib/database/DatabaseGuild';

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
     * Get a guild from the database. Will insert guild if none found.
     * @param guild Guild to fetch
     * @returns Guild data
     */
    public async fetchGuild(guild: Guild): Promise<RawDatabaseGuild> {
        const data = {...(await this.query(`SELECT * FROM guilds WHERE guild_id = ${guild.id};`))[0] || (await this.query(`INSERT INTO guilds (guild_id) VALUES (${guild.id}) RETURNING *`))[0]} as RawDatabaseGuild;

        return data;
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

    public async fetchGuildMembers(guild: Guild): Promise<DatabaseMember[]> {

        // Ensure guild exists.
        await this.fetchGuild(guild);

        const res = await this.query(`SELECT * FROM members WHERE guild_id = ${guild.id}`) as RawDatabaseMember[];

        return res.map(data => new DatabaseMember(data));
    }

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
    public async setChannel(guild: Guild, feature: DatabaseGuild.Channels, channel: Channel): Promise<OkPacket | MysqlError> {

        // Ensure guild exists on database
        await this.fetchGuild(guild);

        // Set values
        return await this.query(`UPDATE guilds SET channel_id_${feature} = ${channel.id} WHERE guild_id = ${guild.id}`);
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

    public async trackVoice(member: GuildMember) {

        this.client.logger.debug(`Tracking voice for ${member.user.tag} in ${member.guild.name}`)

        let i = 0;

        let interval = setInterval(async () => {

            i++;

            if (member.voice.channelId) {

                // If 5th minute and not defeaned and not alone
                if (i % 5 == 0 && (!member.voice.deaf && member.voice.channel!.members.filter(m => !m.user.bot).size > 0)) {
                    
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

}