import { Duration } from "#helpers/duration";
import { alphabet } from "#helpers/emojis";
import type { PrismClient } from "#lib/PrismClient";
import { EmbedBuilder, TimestampStyles } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember, InteractionReplyOptions, ModalSubmitInteraction, TextBasedChannel, User } from "discord.js";

export type PollOptions = {
    question: string
    options: string[];
    duration?: Duration;
    max?: number;
}

export abstract class Poll {

    constructor(interaction: ModalSubmitInteraction, channel: TextBasedChannel, { question, options, duration, max }: PollOptions, client: PrismClient) {
        this.client = client;
        this.max = max || 1;
        this.author = interaction.member instanceof GuildMember ? interaction.member : interaction.user;
        this.interaction = interaction;
        this.channel = channel;
        this.question = question;
        this.options = options.filter(o => o.length > 0).slice(0,20);
        this.duration = duration || new Duration();
    }

    get db() {
        return this.client.db;
    }

    abstract send(): any;
}

export interface Poll {
    client: PrismClient;
    author: User | GuildMember;
    max: number;
    question: string;
    options: string[];
    duration: Duration;
    channel: TextBasedChannel;
    interaction: ModalSubmitInteraction;
}

export class SimplePoll extends Poll {
    public override async send() {
        await this.interaction.reply(this.getReplyOptions())

        const sent = await this.interaction.fetchReply();

        for (let i = 0; i < this.options.length; i++)
            await sent.react(alphabet[i])
    }

    private getReplyOptions(): InteractionReplyOptions {
        return {
            ephemeral: false,
            embeds: [
                new EmbedBuilder()
                    .setTitle(`"${this.question}"`)
                    .setFooter({ text: `${this.author instanceof GuildMember ? this.author.displayName : this.author.tag}'s Poll`, iconURL: this.author.displayAvatarURL() })
                    .setDescription(this.options.map((o:string, i:number) => `${alphabet[i]} : ${o}`).join("\n"))
            ]
        }
    }
}

export class StandardPoll extends Poll {
    public override async send() {
        await this.interaction.reply(this.getReplyOptions());
        const message = await this.interaction.fetchReply();
        const poll = await this.db.createPoll(message, this.interaction.user, this.max, this.duration.isZero() ? null : this.duration.endTimestamp());
        if (!this.duration.isZero())
            this.client.util.trackPoll(poll)
    }

    private getReplyOptions(): InteractionReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle(this.question)
                    .setFooter({ text: `${this.author instanceof GuildMember ? this.author.displayName : this.author.tag}'s Poll`, iconURL: this.author.displayAvatarURL() })
                    .setDescription(this.options.map((o:string, i:number) => `${alphabet[i]} : ${o}`).join("\n"))
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
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('pollResults')
                            .setLabel('View Results')
                            .setStyle(ButtonStyle.Secondary)
                    ])
            ]
        }
    }
}