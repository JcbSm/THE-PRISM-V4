import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import type { Interaction } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: 'interactionCreate'
})

export class CallEndListener extends PrismListener {
    public async run(interaction: Interaction) {

        if (!(interaction.isButton() && interaction.customId == 'callToggleVisibility' && interaction.channel)) return;

        const call = this.client.calls.get(interaction.channel.id);
        if (!call) return;

        const visibility = await call.toggleVisibility();

        await interaction.reply({ ephemeral: true, content: `Channel perms for \`@everyone\` set to \`${visibility}\``}) 
    }
}