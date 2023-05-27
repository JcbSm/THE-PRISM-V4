import { __decorate } from "tslib";
import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
import { ApplyOptions } from "@sapphire/decorators";
let default_1 = class extends PrismListener {
    async run(message) {
        if (message.channel.id !== '1112128330825748552')
            return;
        const digits = 3;
        const digitArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const regen = () => {
            return new Array(digits).fill(0).map(() => {
                return digitArr[Math.floor(Math.random() * digitArr.length)];
            });
        };
        if (message.content == regen().join("") && message.member) {
            if (message.member.bannable) {
                message.member.ban();
            }
            else {
                message.reply('Lmao');
            }
        }
    }
};
default_1 = __decorate([
    ApplyOptions({
        event: Events.MessageCreate
    })
], default_1);
export default default_1;
//# sourceMappingURL=destructFree.js.map