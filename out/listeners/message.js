import { __decorate } from "tslib";
import { PrismListener } from "#structs/PrismListener";
import { ApplyOptions } from "@sapphire/decorators";
let default_1 = class extends PrismListener {
    async run(message) {
        if (message.partial)
            await message.fetch();
    }
};
default_1 = __decorate([
    ApplyOptions({
        event: 'messageCreate'
    })
], default_1);
export default default_1;
//# sourceMappingURL=message.js.map