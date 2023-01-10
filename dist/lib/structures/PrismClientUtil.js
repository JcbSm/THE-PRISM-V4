export class PrismClientUtil {
    constructor(client) {
        this.client = client;
    }
    /**
     * Mention a DatabaseMember.
     * @param {DatabaseMember} member DatabaseMember to mention
     * @param {Guild} guild Guild the member is apart of.
     * @returns {string} If the member exists, a tag. If the member does not exist, the user tag. If the user does not exist, `Deleted User`.
     */
    async mentionDatabaseMember(member, guild) {
        return new Promise(async (resolve) => {
            try {
                resolve(`<@${(await guild.members.fetch(member.user_id)).id}>`);
            }
            catch {
                try {
                    resolve((await this.client.users.fetch(member.user_id)).tag);
                }
                catch {
                    resolve('`Deleted User`');
                }
                ;
            }
            ;
        });
    }
    ;
    /**
     * Get the User for a DatabaseMember
     * @param {DatabaseMember} member DatabaseMember to to get the user for.
     * @returns {Promise<User | undefined>}
     */
    async getDatabaseMemberUser(member) {
        return new Promise(async (resolve) => {
            try {
                resolve((await this.client.users.fetch(member.user_id)));
            }
            catch {
                resolve(undefined);
            }
            ;
        });
    }
    ;
    /**
     * Get GuildMember from User
     * @param {User} user User
     * @param {Guild} guild Guild
     * @returns {Promise<GuildMember | undefined>} Returns GuildMember, if no member exists, returns undefined.
     */
    async getMemberFromUser(user, guild) {
        return new Promise(async (resolve) => {
            try {
                resolve(await guild.members.fetch(user));
            }
            catch {
                resolve(undefined);
            }
        });
    }
}
//# sourceMappingURL=PrismClientUtil.js.map