import { __decorate } from "tslib";
import { updateMessageComponents } from "#helpers/discord";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
let CallIncUserLimitListener = class CallIncUserLimitListener extends PrismListener {
    async run(interaction) {
        if (!(interaction.isButton() && interaction.customId == 'callIncUserLimit' && interaction.channel))
            return;
        const call = this.client.calls.get(interaction.channel.id);
        if (!call)
            return;
        await interaction.update({
            components: updateMessageComponents(interaction.message, [
                {
                    customId: 'callIncUserLimit',
                    update(builder) {
                        builder.setDisabled(true);
                    }
                },
                {
                    customId: 'callDecUserLimit',
                    update(builder) {
                        builder.setDisabled(true);
                    }
                }
            ])
        });
        await call.setUserLimit(call.userLimit + 1);
        await interaction.editReply({
            components: updateMessageComponents(interaction.message, [
                {
                    customId: 'callIncUserLimit',
                    update(builder) {
                        builder.setDisabled(call.userLimit == 99 ? true : false);
                    }
                },
                {
                    customId: 'callDecUserLimit',
                    update(builder) {
                        builder.setDisabled(false);
                    }
                }
            ])
        });
    }
};
CallIncUserLimitListener = __decorate([
    ApplyOptions({
        event: 'interactionCreate'
    })
], CallIncUserLimitListener);
export { CallIncUserLimitListener };
//# sourceMappingURL=incUesrLimit.js.map