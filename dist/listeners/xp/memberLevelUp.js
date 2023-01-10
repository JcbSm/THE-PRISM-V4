import { __decorate } from "tslib";
import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
import { ApplyOptions } from "@sapphire/decorators";
import { isTextBasedChannel } from "@sapphire/discord.js-utilities";
import { EmbedBuilder } from "discord.js";
let default_1 = class extends PrismListener {
    async run(member, level) {
        this.levelUpMessage(member, level);
        this.levelRoles(member, level);
    }
    async levelRoles(member, level) {
        let levelRoles = (await this.db.getLevelRoles(member.guild)).sort((a, b) => b.level - a.level);
        let add = [];
        let rem = [];
        await member.fetch();
        if ((await this.db.fetchGuild(member.guild)).level_roles_stack) {
            add = levelRoles.filter(r => r.level <= level && !member.roles.cache.has(r.role_id));
            rem = levelRoles.filter(r => r.level > level);
        }
        else {
            const max = levelRoles.filter(r => r.level <= level)[0].level;
            add = levelRoles.filter(r => r.level === max && !member.roles.cache.has(r.role_id));
            rem = levelRoles.filter(r => r.level !== max);
        }
        ;
        // For some reason only this works
        for (const id of add.map(r => r.role_id)) {
            await member.roles.add(id);
        }
        for (const id of rem.map(r => r.role_id)) {
            await member.roles.remove(id);
        }
    }
    async levelUpMessage(member, level) {
        const { channel_id_levelup: channel_id } = await this.db.fetchGuild(member.guild);
        const channel = await member.guild.channels.fetch(channel_id);
        if (!channel || !isTextBasedChannel(channel))
            return;
        return channel.send({ embeds: [
                new EmbedBuilder()
                    .setDescription(`${member} advanved to level ${level}!`)
            ] });
    }
};
default_1 = __decorate([
    ApplyOptions({
        event: Events.GuildMemberLevelUp
    })
], default_1);
export default default_1;
//# sourceMappingURL=memberLevelUp.js.map