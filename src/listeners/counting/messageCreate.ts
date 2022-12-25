import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: 'messageCreate'
})

export class CountingListener extends PrismListener {
    public async run(message: Message) {

        
        // Message
        if (message.partial)
        await message.fetch()
        
        if (!message.guild || !message.member)
        return;
        
        // Get data
        const { channel_id_counting, counting_count } = await this.db.fetchGuild(message.guild)
        
        // Check if right channel
        if (!channel_id_counting || message.channel.id !== channel_id_counting) return
        
        // If bot sent a number, don't care
        if (message.author.id === this.client.user?.id && !isNaN(Number(message.content))) return
        
        // If message is not digits
        if (!/^\d+$/.test(message.content)) return message.delete()
        
        const count = Number(message.content);
        
        // Get previous message
        const lastMessage = (await message.channel.messages.fetch({ limit: 1, before: message.id  }).catch(() => undefined))?.first();

        // If same author
        if (lastMessage && (lastMessage.author.id === message.author.id)) return message.delete();

        // If NaN or not next count
        let deleted = false;
        if (isNaN(count) || count !== counting_count + 1) {
            await message.delete();
            deleted = true;
        }

        // If count not the same
        if (lastMessage && Number(lastMessage.content) !== counting_count && count !== counting_count + 1) return message.channel.send(`${counting_count}`);

        // If message was deleted
        else if (deleted) return;

        // Else
        await this.db.updateGuild(message.guild, { counting_count: count });
        return this.db.updateMember(message.member, { counting_counts: 'counting_counts + 1', counting_last_message_url: `'${message.url}'` })
    }
}