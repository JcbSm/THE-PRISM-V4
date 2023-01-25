import { Call } from "#lib/calls/Call";
import type { PrismClient } from "#lib/PrismClient";
import { ButtonInteraction, Collection, Guild, Snowflake, VoiceChannel } from "discord.js";
export declare class CallManager extends Collection<Snowflake, Call> {
    constructor(client: PrismClient);
    /**
     * Initialises the Call Manager. Loading the active calls from the database.
     */
    init(): Promise<void>;
    /**
     * Create's a call
     * @param {Guild} guild Guild the call is in
     * @param {User} user User who initiated the call
     * @param {VoiceChannel} channel VoiceChannel for the call
     * @returns {Call} The created call
     */
    create(guild: Guild, userId: Snowflake, channel: VoiceChannel): Promise<Call>;
    recreate(interaction: ButtonInteraction, guild: Guild, channel: VoiceChannel): Promise<Call>;
    private get db();
}
export interface CallManager {
    client: PrismClient;
}
//# sourceMappingURL=CallManager.d.ts.map