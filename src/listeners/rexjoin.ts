
import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
import { ApplyOptions } from "@sapphire/decorators";
import type { GuildMember } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: Events.GuildMemberAdd
})

export default class extends PrismListener {
    public async run(member: GuildMember) {
        if (member.id === '887416215839076373')
            member.roles.add('1112128366934511648');
    }
}