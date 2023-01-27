import { __decorate } from "tslib";
import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
import { ApplyOptions } from "@sapphire/decorators";
let default_1 = class extends PrismListener {
    async run() {
        const members = await this.db.fetchVoiceMembers();
        const polls = await this.db.fetchActivePolls();
        for (const poll of polls) {
            this.client.util.trackPoll(poll);
        }
        for (const { user_id, guild_id } of members) {
            this.getAndTrackMemberVoice(user_id, guild_id);
        }
        this.client.calls.init();
    }
    async getAndTrackMemberVoice(user_id, guild_id) {
        try {
            const member = await (await this.client.guilds.fetch(guild_id)).members.fetch(user_id);
            if (member) {
                this.db.trackVoice(member);
            }
        }
        catch {
        }
    }
};
default_1 = __decorate([
    ApplyOptions({
        event: Events.ClientReady,
        once: true
    })
], default_1);
export default default_1;
//# sourceMappingURL=ready.js.map