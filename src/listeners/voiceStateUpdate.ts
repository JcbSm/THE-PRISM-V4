import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
import { ApplyOptions } from "@sapphire/decorators";
import type { VoiceState } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: Events.VoiceStateUpdate
})

export default class extends PrismListener {
    public async run(oldState: VoiceState, newState: VoiceState) {

        if (!newState.member)
            return;

        // User did not move channel
        if (oldState.channelId === newState.channelId)
            return;

        // User joined
        if (!oldState.channelId) {
            this.db.trackVoice(newState.member);
        }

        // User left
        if (!newState.channelId) {
        }

        // User switched
        if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
        }

    }
}