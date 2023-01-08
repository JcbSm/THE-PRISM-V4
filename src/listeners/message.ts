import { getLevel } from "#helpers/xp";
import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: Events.MessageCreate
})

export default class extends PrismListener {
    public async run(message: Message) {

        const xp_cooldown = 60 * 1000;
        
        if (message.partial)
        await message.fetch();
        
        if (message.author.bot)
        return;
        
        if (!message.guild || !message.member)
        return;
        
        const { member_id, xp: old_xp, xp_last_message_at } = await this.db.fetchMember(message.member);
        
        // Log message for stats & xp
        await this.db.message(member_id, message.createdTimestamp - xp_last_message_at > xp_cooldown)
        
        const { xp: new_xp } = await this.db.fetchMember(message.member);
        
        // Level up (?)
        if (getLevel(old_xp) < getLevel(new_xp)) {
            this.client.emit(Events.GuildMemberLevelUp, message.member, getLevel(new_xp));
        }
    }
}