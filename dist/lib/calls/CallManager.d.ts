import { Call } from "#lib/calls/Call";
import type { PrismClient } from "#lib/PrismClient";
import { Collection, Guild, Snowflake, User, VoiceChannel } from "discord.js";
export declare class CallManager extends Collection<Snowflake, Call> {
    constructor(client: PrismClient);
    init(): Promise<void>;
    create(guild: Guild, user: User, channel: VoiceChannel): Promise<Call>;
    private get db();
}
export interface CallManager {
    client: PrismClient;
}
//# sourceMappingURL=CallManager.d.ts.map