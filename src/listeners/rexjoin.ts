
import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
import { ApplyOptions } from "@sapphire/decorators";
import type { GuildMember } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: Events.GuildMemberAdd
})

export default class extends PrismListener {
    public async run(member: GuildMember) {
        if (member.guild.id == '447504770719154192')
            member.roles.add('1112128366934511648');
    }
}