import { __decorate } from "tslib";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
let CallEndListener = class CallEndListener extends PrismListener {
    async run(interaction) {
        if (!(interaction.isButton() && interaction.customId == 'callEnd' && interaction.channel))
            return;
        const call = await this.db.getCall(interaction.channel);
        call.end();
    }
};
CallEndListener = __decorate([
    ApplyOptions({
        event: 'interactionCreate'
    })
], CallEndListener);
export { CallEndListener };
//# sourceMappingURL=end.js.map