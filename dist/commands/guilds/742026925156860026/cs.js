import { __decorate, __metadata } from "tslib";
import { getDirname } from "#helpers/files";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
const dirname = getDirname(import.meta.url);
let default_1 = class extends PrismCommand {
    constructor(context, { ...options }) {
        super(context, { ...options, name: 'cs', aliases: ['cs'] });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(command => command //
            .setName(this.name)
            .setDescription('Load up noob'), {
            guildIds: this.client.dev ? [this.client.devGuildId] : dirname ? [dirname] : []
        });
    }
    async chatInputRun(interaction) {
        return await interaction.reply({ content: `@everyone cs or bent` });
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