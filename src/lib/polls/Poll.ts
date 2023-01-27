import type { Duration } from "#helpers/duration";
import { alphabet } from "#helpers/emojis";
import { EmbedBuilder, TimestampStyles } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember, MessageCreateOptions, TextBasedChannel, User } from "discord.js";

export type PollOptions = {
    question: string
    options: string[];
    duration: Duration;
}

export abstract class Poll {

    constructor(author: User | GuildMember, channel: TextBasedChannel, { question, options, duration }: PollOptions) {
        this.author = author;
        this.channel = channel;
        this.question = question;
        this.options = options.filter(o => o.length > 0).slice(0,20);
        this.duration = duration;
    }

    abstract send(): any;
    abstract getMessageOptions(): MessageCreateOptions
}

export interface Poll {
    author: User | GuildMember;
    question: string;
    options: string[];
    duration: Duration;
    channel: TextBasedChannel;
}

export class SimplePoll extends Poll {
    public override async send() {
        const sent = await this.channel.send(this.getMessageOptions())

        for (let i = 0; i < this.options.length; i++)
            await sent.react(alphabet[i])
    }

    public override getMessageOptions(): MessageCreateOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle(`"${this.question}"`)
                    .setFooter({ text: `${this.author instanceof GuildMember ? this.author.displayName : this.author.tag}'s Poll`, iconURL: this.author.displayAvatarURL() })
                    .setDescription(this.options.map((o:string, i:number) => `${alphabet[i]} : ${o}`).join("\n"))
                    .setFields(this.duration.isZero()
                        ? []
                        : [{ name: '\u200b', value: `Ends ${this.duration.toMention(TimestampStyles.RelativeTime)}` }]
                    )
            ]
        }
    }
}

export class StandardPoll extends Poll {
    public override send() {

    }

    public override getMessageOptions(): MessageCreateOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle(this.question)
                    .setAuthor({name: this.author instanceof GuildMember ? this.author.displayName : this.author.tag, iconURL: this.author.displayAvatarURL() })
                    .setDescription(this.options.map((o:string, i:number) => `${alphabet[i]} - ${o}\n`).join("\n"))
                    .setFields(this.duration.isZero()
                        ? []
                        : [{ name: '\u200b', value: `Ends ${this.duration.toMention(TimestampStyles.RelativeTime)}` }]
                    )
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents([
                        new ButtonBuilder()
                            .setCustomId('pollVote')
                            .setLabel('Vote')
                            .setStyle(ButtonStyle.Primary)
                    ])
            ]
        }
    }
}