import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
import { ApplyOptions } from "@sapphire/decorators";
import { isTextBasedChannel } from "@sapphire/discord.js-utilities";
import { GuildMember, MessageEmbed } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: Events.GuildMemberLevelUp
})

export default class extends PrismListener {
    public async run(member: GuildMember, level: number) {

        const { channel_id_levelup: channel_id } = await this.db.fetchGuild(member.guild);
        const channel = await member.guild.channels.fetch(channel_id);

        if (!channel || !isTextBasedChannel(channel))
            return;

        return channel.send({ embeds: [
            new MessageEmbed()
                .setDescription(`${member} advanved to level ${level}!`)
        ]})
    }
}