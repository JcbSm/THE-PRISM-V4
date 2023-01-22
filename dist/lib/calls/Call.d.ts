import type { PrismClient } from "#lib/PrismClient";
import type { RawDatabaseCall } from "#types/database";
import { Guild, User, VoiceChannel } from "discord.js";
export declare class Call {
    private channel_id;
    private user_id;
    constructor(data: RawDatabaseCall, client: PrismClient);
    get guild(): Guild;
    get isPublic(): boolean;
    /**
     * Fetch voice channel
     * @returns {VoiceChannel | null} The channel, if there is one.
     */
    getChannel(): VoiceChannel | void;
    /**
     * Fetch the call owner
     * @returns {User} Discord user
     */
    fetchUser(): Promise<User>;
    /**
     * Send the options message on initialisation.
     * @returns {Message} The send message
     */
    sendOptionsMessage(): Promise<import("discord.js").Message<true> | undefined>;
    /**
     * Ends a call, deleting the channel and the database entry
     * @returns {void} call#deleted
     */
    end(): Promise<void>;
    toggleVisibility(): Promise<boolean>;
    private getOptionsEmbed;
    private getOptionsComponents;
}
export interface Call {
    client: PrismClient;
    id: number;
    guild: Guild;
    user: User;
    channel: VoiceChannel;
    persistent: boolean;
    deleted: boolean;
}
//# sourceMappingURL=Call.d.ts.map