import { __decorate } from "tslib";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
let DebugCommand = class DebugCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(builder => builder
            .setName('debug')
            .setDescription('Debug command for testing.')
            .addUserOption(user => user //
            .setName('user')
            .setDescription('User to debug')
            .setRequired(true)), {
            idHints: ['868234547471462452']
        });
    }
    async chatInputRun(interaction) {
        if (!interaction.guild)
            return;
        if (!interaction.inCachedGuild())
            await interaction.guild.fetch();
        const user = interaction.options.getUser('user');
        if (!user)
            return;
        const member = await interaction.guild.members.fetch({ user: user.id });
        if (!member)
            return;
        console.log(await this.db.fetchMember(member));
        return interaction.reply({ content: "Debugged.", ephemeral: true });
    }
};
DebugCommand = __decorate([
    ApplyOptions({})
], DebugCommand);
export { DebugCommand };
//# sourceMappingURL=debug.js.map