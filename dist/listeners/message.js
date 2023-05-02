import { __decorate } from "tslib";
import { getLevel } from "#helpers/xp";
import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
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
        if (message.guild.id === '447504770719154192' && /meow/gim.test(message.content)) {
            console.log(message.member.moderatable);
            if (message.member.moderatable) {
                message.member.timeout(3 * 60 * 1000, 'No me*wing...');
            }
            message.reply('stfu');
        }
        const { member_id, xp: old_xp, xp_last_message_at } = await this.db.fetchMember(message.member);
        // Log message for stats & xp
        await this.db.message(member_id, message.createdTimestamp - xp_last_message_at > xp_cooldown);
        const { xp: new_xp } = await this.db.fetchMember(message.member);
        // Level up (?)
        if (getLevel(old_xp) < getLevel(new_xp)) {
            this.client.emit(Events.GuildMemberLevelUp, message.member, getLevel(new_xp));
        }
    }
};
default_1 = __decorate([
    ApplyOptions({
        event: Events.MessageCreate
    })
], default_1);
export default default_1;
//# sourceMappingURL=message.js.map