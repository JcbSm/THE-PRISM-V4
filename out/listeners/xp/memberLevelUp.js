import { __decorate } from "tslib";
import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
import { ApplyOptions } from "@sapphire/decorators";
import { isTextBasedChannel } from "@sapphire/discord.js-utilities";
import { MessageEmbed } from "discord.js";
let default_1 = class extends PrismListener {
    async run(member, level) {
        const { channel_id_levelup: channel_id } = await this.db.fetchGuild(member.guild);
        const channel = await member.guild.channels.fetch(channel_id);
        if (!channel || !isTextBasedChannel(channel))
            return;
        return channel.send({ embeds: [
                new MessageEmbed()
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