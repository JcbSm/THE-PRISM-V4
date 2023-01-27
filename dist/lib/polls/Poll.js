import { alphabet } from "#helpers/emojis";
import { EmbedBuilder, TimestampStyles } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember } from "discord.js";
export class Poll {
    constructor(author, channel, { question, options, duration }) {
        this.author = author;
        this.channel = channel;
        this.question = question;
        this.options = options.filter(o => o.length > 0).slice(0, 20);
        this.duration = duration;
    }
}
export class SimplePoll extends Poll {
    async send() {
        const sent = await this.channel.send(this.getMessageOptions());
        for (let i = 0; i < this.options.length; i++)
            await sent.react(alphabet[i]);
    }
    getMessageOptions() {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle(`"${this.question}"`)
                    .setFooter({ text: `${this.author instanceof GuildMember ? this.author.displayName : this.author.tag}'s Poll`, iconURL: this.author.displayAvatarURL() })
                    .setDescription(this.options.map((o, i) => `${alphabet[i]} : ${o}`).join("\n"))
                    .setFields(this.duration.isZero()
                    ? []
                    : [{ name: '\u200b', value: `Ends ${this.duration.toMention(TimestampStyles.RelativeTime)}` }])
            ]
        };
    }
}
export class StandardPoll extends Poll {
    send() {
    }
    getMessageOptions() {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle(this.question)
                    .setAuthor({ name: this.author instanceof GuildMember ? this.author.displayName : this.author.tag, iconURL: this.author.displayAvatarURL() })
                    .setDescription(this.options.map((o, i) => `${alphabet[i]} - ${o}\n`).join("\n"))
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
                        .setStyle(ButtonStyle.Primary)
                ])
            ]
        };
    }
}
//# sourceMappingURL=Poll.js.map