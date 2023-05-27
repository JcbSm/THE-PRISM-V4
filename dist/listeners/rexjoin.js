import { __decorate } from "tslib";
import { PrismListener } from "#structs/PrismListener";
import { Events } from "#types/events";
import { ApplyOptions } from "@sapphire/decorators";
let default_1 = class extends PrismListener {
    async run(member) {
        if (member.id === '887416215839076373')
            member.roles.add('1112128366934511648');
    }
};
default_1 = __decorate([
    ApplyOptions({
        event: Events.GuildMemberAdd
    })
], default_1);
export default default_1;
//# sourceMappingURL=rexjoin.js.map