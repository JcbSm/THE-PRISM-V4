import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import type { Interaction } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: 'interactionCreate'
})

export class CallEndListener extends PrismListener {
    public async run(interaction: Interaction) {

        if (!(interaction.isButton() && interaction.customId == 'callEnd' && interaction.channel)) return;

        const call = await this.db.getCall(interaction.channel);

        call.end();

    }
}