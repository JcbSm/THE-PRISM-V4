import { createPool } from 'mysql';
import { rng } from '#helpers/numbers';
import { DatabaseMember } from '#lib/database/DatabaseMember';
import { DatabaseGuild } from '#lib/database/DatabaseGuild';
export class DatabaseClient {
    constructor(client) {
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
        });
    }
    /**
     * Run a query on the MySQL database
     * @param query Query to be ran
     * @returns Query result
     */
    async query(query, retries = 0) {
        const max_retries = 10;
        const res = await new Promise((res, rej) => {
            this.pool.query({ sql: query, timeout: 10 * 1000 }, async (err, result) => {
                if (err) {
                    if (retries < max_retries) {
                        console.log(`Query Error: ${err.code}. Retrying...`);
                        retries++;
                        await this.query(query, retries);
                        rej(err);
                    }
                    else {
                        console.log(`Query failed after ${retries} retries`);
                        rej(err);
                    }
                }
                else
                    res(result);
            });
        });
        return res;
    }
    /**
     * Converts options object into string useable with query
     * @param options Options to convert
     * @returns Queryable string eg. 'col = val, col = val'
     */
    queryOptions(options) {
        const arr = Object.entries(options);
        return arr.map(v => `${v[0]} = ${v[1]}`).join(", ");
    }
    /**
     * Get a user from the database. Will insert user if none found.
     * @param user User to fetch
     * @returns User data
     */
    async fetchUser(user) {
        return { ...(await this.query(`SELECT * FROM users WHERE user_id = ${user.id};`))[0] || (await this.query(`INSERT INTO users (user_id) VALUES (${user.id}) RETURNING *`))[0] };
    }
    /**
     * Sums all the member data for a specified user
     * @param {User} user User to query for
     * @returns All the summations available in the DatabseMember class
     */
    async sumUserMembers(user) {
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
        `;
        const data = (await this.query(query))[0];
        return data;
    }
    /**
     * Get a guild from the database. Will insert guild if none found.
     * @param guild Guild to fetch
     * @returns Guild data
     */
    async fetchGuild(guild) {
        const data = { ...(await this.query(`SELECT * FROM guilds WHERE guild_id = ${guild.id};`))[0] || (await this.query(`INSERT INTO guilds (guild_id) VALUES (${guild.id}) RETURNING *`))[0] };
        return new DatabaseGuild(data);
    }
    /**
     * Get member data. Will insert if none found
     * @param member GuildMember to fetch
     * @returns Member data
     */
    async fetchMember(member) {
        // Ensure guild and member exist first.
        await this.fetchGuild(member.guild);
        await this.fetchUser(member.user);
        const data = { ...(await this.query(`SELECT * FROM members WHERE user_id = ${member.user.id} AND guild_id = ${member.guild.id};`))[0] || //
                (await this.query(`INSERT INTO members (user_id, guild_id) VALUES (${member.user.id}, ${member.guild.id}) RETURNING *;`))[0] };
        return new DatabaseMember(data);
    }
    /**
     * Fetch all database members
     * @returns {DatabaseMember[]} Every member in the database
     */
    async fetchMembers() {
        return (await this.query(`SELECT * FROM members`)).map((m) => new DatabaseMember(m));
    }
    /**
     * Fetch all DatabaseMembers for a guild
     * @param {Guild} guild Guild to fetch for
     * @returns {Promise<DatabaseMember[]>} DatabaseMember array
     */
    async fetchGuildMembers(guild) {
        // Ensure guild exists.
        await this.fetchGuild(guild);
        const res = await this.query(`SELECT * FROM members WHERE guild_id = ${guild.id}`);
        return res.map(data => new DatabaseMember(data));
    }
    /**
     * Fetch all database members where tracking_voice = true
     * @returns {DatabaseMember[]} Every member in the database where tracking_voice = true
     */
    async fetchVoiceMembers() {
        const res = (await this.query(`SELECT * FROM members WHERE tracking_voice = true`));
        return res.map(data => new DatabaseMember(data));
    }
    /**
     * Update database values for a guild.
     * @param guild DatabaseGuild to update
     * @param options Fields to update
     * @returns MySQL Query result
     */
    async updateGuild(guild, options) {
        await this.fetchGuild(guild);
        return this.query(`UPDATE guilds SET ${this.queryOptions(options)} WHERE guild_id = ${guild.id}`);
    }
    /**
     * Update database values for member.
     * @param member Guildmember to update
     * @param options Fields to update
     * @returns MySQL query results
     */
    async updateMember(member, options) {
        const { member_id } = await this.fetchMember(member);
        return this.query(`UPDATE members SET ${this.queryOptions(options)} WHERE member_id = ${member_id}`);
    }
    /**
     * Sets a channel in the guilds table
     * @param guild Guild to set channel for
     * @param feature Which channel id to set
     * @param channel ID of channel
     * @returns Query result
     */
    async setChannel(guild, feature, channelId) {
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
    async message(member_id, xp = false) {
        const query = `UPDATE members SET total_messages = total_messages + 1 WHERE member_id = ${member_id};`;
        const xp_query = `UPDATE members SET total_messages = total_messages + 1, xp = xp + ${rng(3, 7)}, xp_messages = xp_messages + 1, xp_last_message_at = ${Date.now()} WHERE member_id = ${member_id};`;
        return await this.query(xp ? xp_query : query);
    }
    /**
     * Tracks the voice stats for a member
     * @param {GuildMember} member Memebr to track
     */
    async trackVoice(member) {
        this.client.logger.debug(`Tracking voice for ${member.user.tag} in ${member.guild.name}`);
        let i = 0;
        let interval = setInterval(async () => {
            i++;
            if (member.voice.channelId) {
                // If 5th minute and not defeaned and not alone
                if (i % 5 == 0 && (!member.voice.deaf && member.voice.channel.members.filter(m => !m.user.bot).size > 1)) {
                    this.client.logger.debug(`Adding xp to ${member.user.tag} in ${member.guild.name}`);
                    this.updateMember(member, {
                        total_voice_minutes: 'total_voice_minutes + 1',
                        total_muted_minutes: member.voice.mute ? 'total_muted_minutes + 1' : 'total_muted_minutes',
                        xp_voice_minutes: 'xp_voice_minutes + 5',
                        xp: 'xp + 5',
                        tracking_voice: true
                    });
                }
                else {
                    this.client.logger.debug(`Just incrememneting mnutes`);
                    this.updateMember(member, {
                        total_voice_minutes: 'total_voice_minutes + 1',
                        total_muted_minutes: member.voice.mute ? 'total_muted_minutes + 1' : 'total_muted_minutes',
                        tracking_voice: true,
                    });
                }
            }
            else {
                this.client.logger.debug(`Stopping voice tracking for ${member.user.tag} in ${member.guild.name}`);
                await this.updateMember(member, { tracking_voice: false });
                clearInterval(interval);
            }
        }, 60 * 1000);
    }
    async addLevelRole(role, guild, level) {
        return (await this.query(`INSERT INTO level_roles (guild_id, role_id, level) VALUES (${guild.id}, ${role.id}, ${level}) RETURNING *`))[0];
    }
    async getLevelRoles(guild) {
        return await this.query(`SELECT * FROM level_roles WHERE guild_id = ${guild.id}`);
    }
    async removeLevelRole(id) {
        return await this.query(`DELETE FROM level_roles WHERE level_role_id = ${id}`);
    }
    /**
     * Create a call
     * @param guild Guild
     * @param user User who created
     * @param channel The voice channel
     * @returns The created call
     */
    async createCall(guild, user, channel) {
        return (await this.query(`INSERT INTO calls (guild_id, user_id, channel_id) VALUES (${guild.id}, ${user.id}, ${channel.id}) RETURNING *`))[0];
    }
    /**
     * Deletes a call
     * @param id Call id
     * @returns
     */
    async deleteCall(id) {
        return await this.query(`DELETE FROM calls WHERE call_id = ${id}`);
    }
    /**
     * Get a call from the database
     * @param channel Voice channel
     * @returns Call
     */
    async fetchCall(channel) {
        return (await this.query(`SELECT * FROM calls WHERE channel_id = ${channel.id}`))[0];
    }
    async fetchCalls(guild) {
        return guild
            ? (await this.query(`SELECT * FROM calls WHERE guild_id = ${guild.id}`))
            : (await this.query(`SELECT * FROM calls`));
    }
}
//# sourceMappingURL=DatabaseClient.js.map