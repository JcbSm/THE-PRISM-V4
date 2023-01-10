import { __decorate } from "tslib";
import { PrismPrecondition } from "#structs/PrismPrecondition";
import { ApplyOptions } from "@sapphire/decorators";
let AdministratorPrecondition = class AdministratorPrecondition extends PrismPrecondition {
    async messageRun(message) {
        return message.member ? this.isAdmin(message.member) : this.ok();
    }
    async chatInputRun(interaction) {
        if (!interaction.inCachedGuild())
            return this.error({ message: 'No' });
        return this.isAdmin(interaction.member);
    }
    async contextMenuRun(interaction) {
        if (!interaction.inCachedGuild())
            return this.error({ message: 'No' });
        return this.isAdmin(interaction.member);
    }
    isAdmin(member) {
        return member.permissions.has('Administrator') ? this.ok() : this.error({ message: 'Administrator permissions are required for this command.' });
    }
};
AdministratorPrecondition = __decorate([
    ApplyOptions({
        name: 'Administrator'
    })
], AdministratorPrecondition);
export { AdministratorPrecondition };
//# sourceMappingURL=administrator.js.map