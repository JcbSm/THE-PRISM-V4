import { __decorate, __metadata } from "tslib";
import { parseDirname } from "#helpers/files";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
const dirname = parseDirname(import.meta.url);
let default_1 = class extends PrismCommand {
    constructor(context, { ...options }) {
        super(context, { ...options, name: 'orbent', aliases: ['orbent'] });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(command => command //
            .setName(this.name)
            .setDescription('Load up noob')
            .addStringOption((option) => option //
            .setName('activity')
            .setDescription('_____ or bent')
            .setMaxLength(64)
            .setMinLength(1)
            .setRequired(true)), {
            guildIds: this.client.dev ? [this.client.devGuildId] : dirname ? [dirname] : []
        });
    }
    async chatInputRun(interaction) {
        const activity = interaction.options.getString('activity');
        return await interaction.reply({ content: `@everyone ${activity} or bent` });
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
//# sourceMappingURL=orbent.js.map