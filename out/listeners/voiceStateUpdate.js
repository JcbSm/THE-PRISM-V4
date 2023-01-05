import { __decorate } from "tslib";
import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
import { ApplyOptions } from "@sapphire/decorators";
let default_1 = class extends PrismListener {
    async run(oldState, newState) {
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
};
default_1 = __decorate([
    ApplyOptions({
        event: Events.VoiceStateUpdate
    })
], default_1);
export default default_1;
//# sourceMappingURL=voiceStateUpdate.js.map