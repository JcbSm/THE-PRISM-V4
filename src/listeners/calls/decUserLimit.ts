import { updateMessageComponents } from "#helpers/discord";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
import type { ButtonBuilder, Interaction } from "discord.js";

@ApplyOptions<PrismListener.Options>({
    event: 'interactionCreate'
})

export class CallIncUserLimitListener extends PrismListener {
    public async run(interaction: Interaction) {

        if (!(interaction.isButton() && interaction.customId == 'callDecUserLimit' && interaction.channel)) return;

        const call = this.client.calls.get(interaction.channel.id);
        if (!call) return;

        await interaction.update({
            components: updateMessageComponents(interaction.message, [
                {
                    customId: 'callIncUserLimit',
                    update(builder: ButtonBuilder) {
                        builder.setDisabled(true)
                    }
                },
                {
                    customId: 'callDecUserLimit',
                    update(builder: ButtonBuilder) {
                        builder.setDisabled(true)
                    }
                }
            ])
        })

        await call.setUserLimit(call.userLimit - 1);

        await interaction.editReply({
            components: updateMessageComponents(interaction.message, [
                {
                    customId: 'callIncUserLimit',
                    update(builder: ButtonBuilder) {
                        builder.setDisabled(call.userLimit == 99 ? true : false)
                    }
                },
                {
                    customId: 'callDecUserLimit',
                    update(builder: ButtonBuilder) {
                        builder.setDisabled(call.userLimit == 0 ? true : false)
                    }
                }
            ])
        })
    }
}