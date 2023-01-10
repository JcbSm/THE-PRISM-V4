import { __decorate } from "tslib";
import { leaderboard } from "#helpers/xp";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { AttachmentBuilder } from "discord.js";
let LeaderboardCommand = class LeaderboardCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder //
            .setName('levels')
            .setDescription('View the levels leaderboard for the server.')
            .addIntegerOption((option) => option //
            .setName('page')
            .setDescription('Page of the leaderboard to view')
            .setMinValue(1)));
    }
    async chatInputRun(interaction) {
        if (!interaction.guild)
            return;
        const members = (await this.db.fetchGuildMembers(interaction.guild)).sort((a, b) => b.xp - a.xp);
        const page = interaction.options.getInteger('page') || 1;
        const maxPage = Math.ceil(members.length / 10);
        if (page > maxPage) {
            return interaction.reply({ content: `Page out of range. Max: \`${maxPage}\``, ephemeral: true });
        }
        await interaction.deferReply();
        return await interaction.editReply({
            files: [
                new AttachmentBuilder(await leaderboard(members, page - 1, interaction.guild, this.client))
                    .setName('leaderboard.png')
            ]
        });
    }
};
LeaderboardCommand = __decorate([
    ApplyOptions({})
], LeaderboardCommand);
export { LeaderboardCommand };
//# sourceMappingURL=levels.js.map