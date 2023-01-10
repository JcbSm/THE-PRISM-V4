import { PrismListener } from "#structs/PrismListener";
import type { VoiceState } from "discord.js";
export default class extends PrismListener {
    run(oldState: VoiceState, newState: VoiceState): Promise<void>;
}
//# sourceMappingURL=voiceStateUpdate.d.ts.map