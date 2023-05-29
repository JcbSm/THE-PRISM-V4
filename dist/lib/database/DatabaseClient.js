import { createPool } from 'mysql';
import { rng } from '#helpers/numbers';
import { DatabaseMember } from '#lib/database/DatabaseMember';
import { DatabaseGuild } from '#lib/database/DatabaseGuild';
export class QueryResponse {
    constructor(success, result, error = null) {
        this.success = success;
        this.result = result;
        this.error = error;
    }
}
export class QueryResult extends QueryResponse {
    constructor(result) {
        super(true, result);
    }
}
export class QueryError extends QueryResponse {
    constructor(error) {
        super(false, null, error);
    }
}
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
    async query(sql) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, con) => {
                if (err)
                    reject(new QueryError(err));
                if (con)
                    con.query({ sql, timeout: 10 * 1000 }, (err, rows) => {
                        con.release();
                        if (err)
                            reject(new QueryError(err));
                        resolve(new QueryResult(rows));
                    });
                else
                    resolve(new QueryError("Unable to connect"));
            });
        });
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
        return { ...(await this.query(`SELECT * FROM users WHERE user_id = ${user.id};`)).result[0] || (await this.query(`INSERT INTO users (user_id) VALUES (${user.id}) RETURNING *`)).result[0] };
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
        const data = (await this.query(query)).result[0];
        return data;
    }
    /**
     * Get a guild from the database. Will insert guild if none found.
     * @param guild Guild to fetch
     * @returns Guild data
     */
    async fetchGuild(guild) {
        const data = { ...(await this.query(`SELECT * FROM guilds WHERE guild_id = ${guild.id};`)).result[0] || (await this.query(`INSERT INTO guilds (guild_id) VALUES (${guild.id}) RETURNING *`)).result[0] };
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
        const data = { ...(await this.query(`SELECT * FROM members WHERE user_id = ${member.user.id} AND guild_id = ${member.guild.id};`)).result[0] || //
                (await this.query(`INSERT INTO members (user_id, guild_id) VALUES (${member.user.id}, ${member.guild.id}) RETURNING *;`)).result[0] };
        return new DatabaseMember(data);
    }
    /**
     * Fetch all database members
     * @returns {DatabaseMember[]} Every member in the database
     */
    async fetchMembers() {
        return (await this.query(`SELECT * FROM members`)).result.map((m) => new DatabaseMember(m));
    }
    /**
     * Fetch all DatabaseMembers for a guild
     * @param {Guild} guild Guild to fetch for
     * @returns {Promise<DatabaseMember[]>} DatabaseMember array
     */
    async fetchGuildMembers(guild) {
        // Ensure guild exists.
        await this.fetchGuild(guild);
        const res = (await this.query(`SELECT * FROM members WHERE guild_id = ${guild.id}`)).result;
        return res.map(data => new DatabaseMember(data));
    }
    /**
     * Fetch all database members where tracking_voice = true
     * @returns {DatabaseMember[]} Every member in the database where tracking_voice = true
     */
    async fetchVoiceMembers() {
        const res = (await this.query(`SELECT * FROM members WHERE tracking_voice = true`)).result;
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
        return (await this.query(`UPDATE guilds SET channel_id_${feature} = ${channelId} WHERE guild_id = ${guild.id}`)).result;
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
        return (await this.query(`INSERT INTO level_roles (guild_id, role_id, level) VALUES (${guild.id}, ${role.id}, ${level}) RETURNING *`)).result[0];
    }
    async getLevelRoles(guild) {
        return (await this.query(`SELECT * FROM level_roles WHERE guild_id = ${guild.id}`)).result;
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
    async createCall(guild, userId, channel) {
        return (await this.query(`INSERT INTO calls (guild_id, user_id, channel_id) VALUES (${guild.id}, ${userId}, ${channel.id}) RETURNING *`)).result[0];
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
        return (await this.query(`SELECT * FROM calls WHERE channel_id = ${channel.id}`)).result[0];
    }
    async fetchMemberCall(member) {
        return (await this.query(`SELECT * FROM calls WHERE user_id = ${member.id} AND guild_id = ${member.guild.id}`)).result[0];
    }
    async fetchCalls(guild) {
        return guild
            ? (await this.query(`SELECT * FROM calls WHERE guild_id = ${guild.id}`)).result
            : (await this.query(`SELECT * FROM calls`)).result;
    }
    async rps(guild, user, opponent, outcome) {
        const userfield = outcome > 0 ? 'wins' : outcome < 0 ? 'losses' : 'draws';
        const oponentfield = outcome < 0 ? 'wins' : outcome > 0 ? 'losses' : 'draws';
        this.query(`UPDATE members SET rps_${userfield} = rps_${userfield} + 1 WHERE user_id = ${user.id} AND guild_id = ${guild.id}`);
        this.query(`UPDATE members SET rps_${oponentfield} = rps_${oponentfield} + 1 WHERE user_id = ${opponent.id} AND guild_id = ${guild.id}`);
    }
    async createPoll(message, user, maxchoices, end) {
        return (await this.query(`INSERT INTO polls (message_url, user_id, end_timestamp, max_choices) VALUES ('${message.url}', ${user.id}, ${end}, ${maxchoices}) RETURNING *`)).result[0];
    }
    async fetchPoll(message) {
        return (await this.query(`SELECT * FROM polls WHERE message_url = '${message.url}'`)).result[0];
    }
    async vote(pollId, user_id, vote) {
        return (await this.query(`REPLACE INTO poll_votes (poll_id, user_id, vote) VALUES (${pollId}, ${user_id}, ${vote})`));
    }
    async fetchVotes(pollId) {
        return (await this.query(`SELECT * FROM poll_votes WHERE poll_id = ${pollId}`)).result;
    }
    async fetchActivePolls() {
        return (await this.query(`SELECT * FROM polls WHERE end_timestamp > ${Date.now()}`)).result;
    }
}
//# sourceMappingURL=DatabaseClient.js.map