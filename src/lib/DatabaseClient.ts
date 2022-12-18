import { Connection, createConnection, MysqlError, OkPacket } from 'mysql';
import type { PrismClient } from '#lib/Client';
import type { Channel, Guild, GuildMember, User } from 'discord.js';
import type { 
    DatabaseUser,
    DatabaseGuild,
    DatabaseMember
} from './typedefs/database';

export interface DatabaseClient {
    client: PrismClient;
    connection: Connection;
    db: DatabaseClient;
}

export class DatabaseClient {
    constructor(client: PrismClient) {
        this.client = client;
        this.db = this.client.db;
        this.getConnection();
    }

    /**
     * Attempts to connect to the MySQL database.
     * @returns { Promise<Connection | MysqlError> } The established connection
     */
    public async connect(): Promise<Connection | MysqlError> {

        let connection = this.connection;

        return new Promise((res, rej) => {
            connection.connect((err) => {
                err ? rej(err) : res(connection);
            })
        })
    }

    /**
     * Gets the Database URL from .env and creates the connection.
     * @returns { Connection } MySQL Connection.
     */
    private getConnection() {

        // Check if DB_URL is provided in .env
        if (!process.env.DB_URL) {
            this.client.logger.fatal("No DB_URL found in .env. Exiting process.");
            this.client.destroy();
            process.exit(1);
        }

        this.connection = createConnection(process.env.DB_URL);
        this.connection.config.supportBigNumbers = true;
    }

    /**
     * Run a query on the MySQL database
     * @param query Query to be ran
     * @returns Query result
     */
    private async query(query: string): Promise<any> {

        return new Promise((res, rej) => {
            this.connection.query(query, (err, result) => {

                if (err) {
                    rej(err);
                } else
                    res(result);

            })
        });
    }

    /**
     * Get a user from the database. Will insert user if none found.
     * @param user User to fetch
     * @returns User data
     */
    public async fetchUser(user: User): Promise<DatabaseUser> {
        return {...(await this.query(`SELECT * FROM users WHERE user_id = ${user.id};`))[0] || (await this.query(`INSERT INTO users (user_id) VALUES (${user.id}) RETURNING *`))[0]}
    }

    /**
     * Get a guild from the database. Will insert guild if none found.
     * @param guild Guild to fetch
     * @returns Guild data
     */
    public async fetchGuild(guild: Guild): Promise<DatabaseGuild> {
        return {...(await this.query(`SELECT * FROM guilds WHERE guild_id = ${guild.id};`))[0] || (await this.query(`INSERT INTO guilds (guild_id) VALUES (${guild.id}) RETURNING *`))[0]};
    }

    /**
     * Get member data. Will insert if none found
     * @param member GuildMember to fetch
     * @returns Member data
     */
    public async fetchMember(member: GuildMember): Promise<DatabaseMember> {

        // Ensure guild and member exist first.
        await this.fetchGuild(member.guild); await this.fetchUser(member.user);

        const res = {...(await this.query(`SELECT * FROM members WHERE user_id = ${member.user.id} AND guild_id = ${member.guild.id};`))[0] || //
            (await this.query(`INSERT INTO members (user_id, guild_id) VALUES (${member.user.id}, ${member.guild.id}) RETURNING *;`))[0]};

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
     * XP FUNCTIONS
     */
    public async addXP(member: DatabaseMember): Promise<void> {

        member;

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

    private queryOptions(options: DatabaseGuild.Options | DatabaseMember.Options): string {
        const arr = Object.entries(options);
        return arr.map(v => `${v[0]} = ${v[1]}`).join(", ")
    }
}