import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: 'messageCreate'
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

        const { member_id, xp_last_message_at } = await this.db.fetchMember(message.member);

        // Log message for stats
        this.db.message(member_id, message.createdTimestamp - xp_last_message_at > xp_cooldown)
    }
}