import { __decorate } from "tslib";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
let default_1 = class extends PrismListener {
    async run(message) {
        const xp_cooldown = 60 * 1000;
        if (message.partial)
            await message.fetch();
        if (message.author.bot)
            return;
        if (!message.guild || !message.member)
            return;
        const { member_id, xp_last_message_at } = await this.db.fetchMember(message.member);
        // Log message for stats
        this.db.message(member_id, message.createdTimestamp - xp_last_message_at > xp_cooldown);
    }
};
default_1 = __decorate([
    ApplyOptions({
        event: 'messageCreate'
    })
], default_1);
export default default_1;
//# sourceMappingURL=message.js.map