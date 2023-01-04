import { createConnection } from 'mysql';
import { rng } from '#helpers/numbers';
export class DatabaseClient {
    constructor(client) {
        this.client = client;
        this.db = this.client.db;
        this.connection = createConnection({
            host: process.env.DB_HOST,
            port: 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            supportBigNumbers: true,
        });
    }
    /**
     * Attempts to connect to the MySQL database.
     * @returns { Promise<Connection | MysqlError> } The established connection
     */
    async connect() {
        let connection = this.connection;
        return new Promise((res, rej) => {
            connection.connect((err) => {
                err ? rej(err) : res(connection);
            });
        });
    }
    /**
     * Run a query on the MySQL database
     * @param query Query to be ran
     * @returns Query result
     */
    async query(query) {
        const res = await new Promise((res, rej) => {
            this.connection.query({ sql: query, timeout: 10 * 1000 }, (err, result) => {
                if (err) {
                    rej(err);
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
     * Get a guild from the database. Will insert guild if none found.
     * @param guild Guild to fetch
     * @returns Guild data
     */
    async fetchGuild(guild) {
        return { ...(await this.query(`SELECT * FROM guilds WHERE guild_id = ${guild.id};`))[0] || (await this.query(`INSERT INTO guilds (guild_id) VALUES (${guild.id}) RETURNING *`))[0] };
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
        const res = { ...(await this.query(`SELECT * FROM members WHERE user_id = ${member.user.id} AND guild_id = ${member.guild.id};`))[0] || //
                (await this.query(`INSERT INTO members (user_id, guild_id) VALUES (${member.user.id}, ${member.guild.id}) RETURNING *;`))[0] };
        // Convert TINYINT(1) to boolean
        res.voice = Boolean(res.voice);
        return res;
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
    async setChannel(guild, feature, channel) {
        // Ensure guild exists on database
        await this.fetchGuild(guild);
        // Set values
        return await this.query(`UPDATE guilds SET channel_id_${feature} = ${channel.id} WHERE guild_id = ${guild.id}`);
    }
    /**
     * Add xp to a DatabaseMember
     * @param member Member to add xp to
     * @param reason Reason for xp gain. 'message' or 'voice'
     * @returns Query result
     */
    async addXP(member, reason) {
        const { member_id } = await this.fetchMember(member);
        let xp = 0;
        if (reason === 'message') {
            xp = rng(3, 7);
        }
        if (reason === 'voice') {
            xp = 5;
        }
        return await this.query(`UPDATE members SET xp = xp + ${xp} WHERE member_id = ${member_id};`);
    }
}
//# sourceMappingURL=DatabaseClient.js.map