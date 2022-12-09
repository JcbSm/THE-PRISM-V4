import { createConnection } from 'mysql';
export class DatabaseClient {
    constructor(client) {
        this.client = client;
        this.connection = this.getConnection();
        this.db = this.client.db;
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
     * Gets the Database URL from .env and creates the connection.
     * @returns { Connection } MySQL Connection.
     */
    getConnection() {
        // Check if DB_URL is provided in .env
        if (!process.env.DB_URL) {
            this.client.logger.fatal("No DB_URL found in .env. Exiting process.");
            this.client.destroy();
            process.exit(1);
        }
        return createConnection(process.env.DB_URL);
    }
    /**
     * Run a query on the MySQL database
     * @param query Query to be ran
     * @returns Query result
     */
    async query(query) {
        return new Promise((res, rej) => {
            this.connection.query(query, (err, result) => {
                if (err)
                    rej(err);
                else
                    res(result);
            });
        });
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
}
//# sourceMappingURL=DatabaseClient.js.map