import type { DatabaseMember } from "#lib/database/DatabaseMember";
import type { PrismClient } from "#lib/PrismClient";
import type { RawDatabasePoll } from "#types/database";
import { Guild, GuildMember, User } from "discord.js";
export declare class PrismClientUtil {
    constructor(client: PrismClient);
    /**
     * Mention a DatabaseMember.
     * @param {DatabaseMember} member DatabaseMember to mention
     * @param {Guild} guild Guild the member is apart of.
     * @returns {string} If the member exists, a tag. If the member does not exist, the user tag. If the user does not exist, `Deleted User`.
     */
    mentionDatabaseMember(member: DatabaseMember, guild: Guild): Promise<string>;
    /**
     * Get the User for a DatabaseMember
     * @param {DatabaseMember} member DatabaseMember to to get the user for.
     * @returns {Promise<User | undefined>}
     */
    getDatabaseMemberUser(member: DatabaseMember): Promise<User | undefined>;
    /**
     * Get GuildMember from User
     * @param {User} user User
     * @param {Guild} guild Guild
     * @returns {Promise<GuildMember | undefined>} Returns GuildMember, if no member exists, returns undefined.
     */
    getMemberFromUser(user: User, guild: Guild): Promise<GuildMember | undefined>;
    fetchMessageFromURL(url: string): Promise<import("discord.js").Message<boolean> | undefined>;
    trackPoll(poll: RawDatabasePoll): Promise<void>;
    regenChannel(): Promise<void>;
}
export interface PrismClientUtil {
    client: PrismClient;
}
//# sourceMappingURL=PrismClientUtil.d.ts.map