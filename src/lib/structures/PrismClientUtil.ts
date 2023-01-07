import type { DatabaseMember } from "#lib/database/DatabaseMember";
import type { PrismClient } from "#lib/PrismClient";
import type { Guild, GuildMember, User } from "discord.js";

export class PrismClientUtil {
    constructor(client: PrismClient) {
        this.client = client;
    }

    /**
     * Mention a DatabaseMember.
     * @param {DatabaseMember} member DatabaseMember to mention
     * @param {Guild} guild Guild the member is apart of.
     * @returns {string} If the member exists, a tag. If the member does not exist, the user tag. If the user does not exist, `Deleted User`.
     */
    public async mentionDatabaseMember(member: DatabaseMember, guild: Guild): Promise<string> {

        return new Promise(async (resolve: (s: string) => void) => {

            try {

                resolve(`<@${(await guild.members.fetch(member.user_id!)).id}>`);
    
            } catch {
    
                try {
                    resolve((await this.client.users.fetch(member.user_id!)).tag);
                } catch {
                    resolve('`Deleted User`')
                };
    
            };
        })
    };

    /**
     * Get the User for a DatabaseMember
     * @param {DatabaseMember} member DatabaseMember to to get the user for.
     * @returns {Promise<User | undefined>}
     */
    public async getDatabaseMemberUser(member: DatabaseMember): Promise<User | undefined> {

        return new Promise(async (resolve: (s: User | undefined) => void) => {    
            try {
                resolve((await this.client.users.fetch(member.user_id!)));
            } catch {
                resolve(undefined)
            };    
        })
    };

    /**
     * Get GuildMember from User
     * @param {User} user User
     * @param {Guild} guild Guild
     * @returns {Promise<GuildMember | undefined>} Returns GuildMember, if no member exists, returns undefined.
     */
    public async getMemberFromUser(user: User, guild: Guild): Promise<GuildMember | undefined> {

        return new Promise(async (resolve: (m: GuildMember | undefined) => void) => {

            try {
                resolve(await guild.members.fetch(user));
            } catch {
                resolve(undefined);
            }

        })

    }
}

export interface PrismClientUtil {
    client: PrismClient;
}