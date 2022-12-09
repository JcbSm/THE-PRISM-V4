import { __decorate, __metadata } from "tslib";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
let default_1 = class extends PrismCommand {
    constructor(context, { ...options }) {
        super(context, { ...options, name: 'cs', aliases: ['cs'] });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(command => command //
            .setName('cs')
            .setDescription('Load up noob'), {
            guildIds: ['742026925156860026'],
            idHints: ['1050830508906528849']
        });
    }
    async chatInputRun(interaction) {
        interaction.reply({ content: `@everyone cs or bent` });
    }
};
default_1 = __decorate([
    ApplyOptions({
        name: 'cs',
        aliases: []
    }),
    __metadata("design:paramtypes", [Object, Object])
], default_1);
export default default_1;
//# sourceMappingURL=cs.js.map