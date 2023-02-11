import { PrismListener } from "#structs/PrismListener";
import type { RawDatabaseLevelRole } from "#types/database";
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

        let levelRoles = (await this.db.getLevelRoles(member.guild)).sort((a, b) => b.level - a.level)

        let add: RawDatabaseLevelRole[] = []; let rem: RawDatabaseLevelRole[] = [];

        await member.fetch()

        if ((await this.db.fetchGuild(member.guild)).level_roles_stack) {

            add = levelRoles.filter(r => r.level <= level && !member.roles.cache.has(r.role_id));
            rem = levelRoles.filter(r => r.level > level);

        } else {

            const max = levelRoles.filter(r => r.level <= level)[0].level;

            add = levelRoles.filter(r => r.level === max && !member.roles.cache.has(r.role_id))
            rem = levelRoles.filter(r => r.level !== max)

        };
        
        // For some reason only this works
        for (const id of add.map(r => r.role_id)) {
            await member.roles.add(id);
        }
        for (const id of rem.map(r => r.role_id)) {
            await member.roles.remove(id);
        }

    }
    
    private async levelUpMessage(member: GuildMember, level: number) {
        
        const { channel_id_levelup: channel_id } = await this.db.fetchGuild(member.guild);

        if (!channel_id) return;

        const channel = await member.guild.channels.fetch(channel_id);

        if (!channel || !isTextBasedChannel(channel))
            return;

        return channel.send({ embeds: [
            new EmbedBuilder()
                .setDescription(`${member} advanced to level ${level}!`)
        ]})
    }
}
