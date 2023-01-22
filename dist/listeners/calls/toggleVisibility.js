import { __decorate } from "tslib";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
let CallEndListener = class CallEndListener extends PrismListener {
    async run(interaction) {
        if (!(interaction.isButton() && interaction.customId == 'callToggleVisibility' && interaction.channel))
            return;
        const call = this.client.calls.get(interaction.channel.id);
        if (!call)
            return;
        const visibility = await call.toggleVisibility();
        await interaction.reply({ ephemeral: true, content: `Channel perms for \`@everyone\` set to \`${visibility}\`` });
    }
};
CallEndListener = __decorate([
    ApplyOptions({
        event: 'interactionCreate'
    })
], CallEndListener);
export { CallEndListener };
//# sourceMappingURL=toggleVisibility.js.map