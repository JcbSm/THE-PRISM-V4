import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
import { ApplyOptions } from "@sapphire/decorators";
import { isTextBasedChannel } from "@sapphire/discord.js-utilities";
import { GuildMember, EmbedBuilder } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: Events.GuildMemberLevelUp
})

export default class extends PrismListener {
    public async run(member: GuildMember, level: number) {
        this.levelUpMessage(member, level);
        this.levelRoles(member, level);
    }

    private async levelRoles(member: GuildMember, level: number) {

        const level_roles = (await this.db.getLevelRoles(member.guild)).filter(r => r.level <= level);

        console.log(level_roles);

    }
    
    private async levelUpMessage(member: GuildMember, level: number) {
        
        const { channel_id_levelup: channel_id } = await this.db.fetchGuild(member.guild);
        const channel = await member.guild.channels.fetch(channel_id);

        if (!channel || !isTextBasedChannel(channel))
            return;

        return channel.send({ embeds: [
            new EmbedBuilder()
                .setDescription(`${member} advanved to level ${level}!`)
        ]})
    }
}