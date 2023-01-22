import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
import { ApplyOptions } from "@sapphire/decorators";
import type { Snowflake } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: Events.ClientReady,
    once: true
})

export default class extends PrismListener {
    public async run() {

        const members = await this.db.fetchVoiceMembers();

        for (const { user_id, guild_id } of members)
            this.getAndTrackMemberVoice(user_id, guild_id);

        this.client.calls.init();

    }

    private async getAndTrackMemberVoice(user_id: Snowflake, guild_id: Snowflake) {

        try {
            const member = await (await this.client.guilds.fetch(guild_id)).members.fetch(user_id);

            if (member) {
                this.db.trackVoice(member);
            }
        } catch {
        }

    }
}