import type { Duration } from "#helpers/duration";
import { GuildMember, MessageCreateOptions, TextBasedChannel, User } from "discord.js";
export type PollOptions = {
    question: string;
    options: string[];
    duration: Duration;
};
export declare abstract class Poll {
    constructor(author: User | GuildMember, channel: TextBasedChannel, { question, options, duration }: PollOptions);
    abstract send(): any;
    abstract getMessageOptions(): MessageCreateOptions;
}
export interface Poll {
    author: User | GuildMember;
    question: string;
    options: string[];
    duration: Duration;
    channel: TextBasedChannel;
}
export declare class SimplePoll extends Poll {
    send(): Promise<void>;
    getMessageOptions(): MessageCreateOptions;
}
export declare class StandardPoll extends Poll {
    send(): void;
    getMessageOptions(): MessageCreateOptions;
}
//# sourceMappingURL=Poll.d.ts.map