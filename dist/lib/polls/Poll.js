import { Duration } from "#helpers/duration";
import { alphabet } from "#helpers/emojis";
import { EmbedBuilder, TimestampStyles } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember } from "discord.js";
export class Poll {
    constructor(interaction, channel, { question, options, duration, max }, client) {
        this.client = client;
        this.max = max || 1;
        this.author = interaction.member instanceof GuildMember ? interaction.member : interaction.user;
        this.interaction = interaction;
        this.channel = channel;
        this.question = question;
        this.options = options.filter(o => o.length > 0).slice(0, 20);
        this.duration = duration || new Duration();
    }
    get db() {
        return this.client.db;
    }
}
export class SimplePoll extends Poll {
    async send() {
        await this.interaction.reply(this.getReplyOptions());
        const sent = await this.interaction.fetchReply();
        for (let i = 0; i < this.options.length; i++)
            await sent.react(alphabet[i]);
    }
    getReplyOptions() {
        return {
            ephemeral: false,
            embeds: [
                new EmbedBuilder()
                    .setTitle(`"${this.question}"`)
                    .setFooter({ text: `${this.author instanceof GuildMember ? this.author.displayName : this.author.tag}'s Poll`, iconURL: this.author.displayAvatarURL() })
                    .setDescription(this.options.map((o, i) => `${alphabet[i]} : ${o}`).join("\n"))
            ]
        };
    }
}
export class StandardPoll extends Poll {
    async send() {
        await this.interaction.reply(this.getReplyOptions());
        const message = await this.interaction.fetchReply();
        const poll = await this.db.createPoll(message, this.interaction.user, this.max, this.duration.isZero() ? null : this.duration.endTimestamp());
        if (!this.duration.isZero())
            this.client.util.trackPoll(poll);
    }
    getReplyOptions() {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle(this.question)
                    .setFooter({ text: `${this.author instanceof GuildMember ? this.author.displayName : this.author.tag}'s Poll`, iconURL: this.author.displayAvatarURL() })
                    .setDescription(this.options.map((o, i) => `${alphabet[i]} : ${o}`).join("\n"))
                    .setFields(this.duration.isZero()
                    ? []
                    : [{ name: '\u200b', value: `Ends ${this.duration.toMention(TimestampStyles.RelativeTime)}` }])
            ],
            components: [
                new ActionRowBuilder()
                    .setComponents([
                    new ButtonBuilder()
                        .setCustomId('pollVote')
                        .setLabel('Vote')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('pollResults')
                        .setLabel('View Results')
                        .setStyle(ButtonStyle.Secondary)
                ])
            ]
        };
    }
}
//# sourceMappingURL=Poll.js.map