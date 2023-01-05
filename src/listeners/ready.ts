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

        console.log("Online.")

        const members = await this.db.fetchVoiceMembers();

        for (const { user_id, guild_id } of members)
            this.getAndTrackMemberVoice(user_id, guild_id);

    }

    private async getAndTrackMemberVoice(user_id: Snowflake, guild_id: Snowflake) {

        console.log(`Attempting voice tracking for user ${user_id} in guild ${guild_id}`);

        try {
            const member = await (await this.client.guilds.fetch(guild_id)).members.fetch(user_id);

            if (member) {
                this.db.trackVoice(member);
            }
        } catch {
            console.log(`Missing access for user ${user_id} in guild ${guild_id}.`);
        }

    }
}