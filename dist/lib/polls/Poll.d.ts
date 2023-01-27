import { Duration } from "#helpers/duration";
import type { PrismClient } from "#lib/PrismClient";
import { GuildMember, ModalSubmitInteraction, TextBasedChannel, User } from "discord.js";
export type PollOptions = {
    question: string;
    options: string[];
    duration?: Duration;
    max?: number;
};
export declare abstract class Poll {
    constructor(interaction: ModalSubmitInteraction, channel: TextBasedChannel, { question, options, duration, max }: PollOptions, client: PrismClient);
    get db(): import("../database/DatabaseClient").DatabaseClient;
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
export declare class SimplePoll extends Poll {
    send(): Promise<void>;
    private getReplyOptions;
}
export declare class StandardPoll extends Poll {
    send(): Promise<void>;
    private getReplyOptions;
}
//# sourceMappingURL=Poll.d.ts.map