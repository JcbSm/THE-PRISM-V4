import { getPollResults, resultsCanvas } from "#helpers/polls";
import type { DatabaseMember } from "#lib/database/DatabaseMember";
import type { PrismClient } from "#lib/PrismClient";
import type { RawDatabasePoll } from "#types/database";
import { AttachmentBuilder, ChannelType, EmbedBuilder, Guild, GuildChannel, GuildMember, Snowflake, TextBasedChannel, User } from "discord.js";

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

    public async fetchMessageFromURL(url: string) {
        try {
            let arr = url.match(/\d[\d\/]+/)![0].split('/');
            return await (await this.client.channels.fetch(arr[1] as Snowflake) as TextBasedChannel)?.messages.fetch(arr[2] as Snowflake)
        } catch {
            return undefined
        }
    }

    public async trackPoll(poll: RawDatabasePoll) {

        this.client.logger.debug(`Tracking poll ${poll.poll_id}`)

        const message = await this.client.util.fetchMessageFromURL(poll.message_url);
        const timer = poll.end_timestamp - Date.now();

        if (!message) return;

        if (timer > 2147483647) {
            setTimeout(async () => {
                this.trackPoll(await this.client.db.fetchPoll(message))
            }, 2147483647)
        } else {

            setTimeout(async () => {

                const { optionValues, results, totalVotes } = await getPollResults(this.client.db, message)

                message.edit({ 
                    files: totalVotes > 0 ? [
                        new AttachmentBuilder(resultsCanvas(optionValues, results), { name: 'data.png'})
                    ] : [],
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Poll')
                            .setDescription(message.embeds[0].description!.split("\n").map((s, i) => `${s} \`${results[i]} votes\``).join("\n"))
                            .setImage('attachment://data.png')
                    ],
                    components: []
                })
            }, timer);
        }
    }

    public async regenChannel() {

        const parentID = this.client.dev ? '1074294071956357140' : '1063484760820813886';

        const deleteChannel = async () => {

            const channels = this.client.channels.cache.filter((c) => c.type !== ChannelType.DM && c.type !== ChannelType.GroupDM && c.parentId == parentID);

            for (const [,channel] of channels) {
                
                if (!(channel instanceof GuildChannel)) return;
                
                const newChannel = await channel.clone();

                if (channel.isTextBased()) {
                    await channel.send({ embeds: [
                        {
                            title: 'CHANNEL ROTATION',
                            description: `Please move to the new channel:\n${newChannel}`
                        }
                    ]})
                }

                setTimeout(() => {
                    channel.delete().catch(() => {console.log("Unabel to delete channel")});
                }, 5*1000);
            }

        }
        
        deleteChannel();
        setInterval(deleteChannel, 6*60*60*1000);
    }
}

export interface PrismClientUtil {
    client: PrismClient;
}