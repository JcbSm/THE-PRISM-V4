import { __decorate } from "tslib";
import { percentage } from "#helpers/numbers";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandType, EmbedBuilder, GuildMember } from "discord.js";
let CountingCommand = class CountingCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(command => command //
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option => option //
            .setName('user')
            .setDescription('User\'s stats to view')));
        registry.registerContextMenuCommand(command => command //
            .setName(this.description)
            .setType(ApplicationCommandType.User));
    }
    async chatInputRun(interaction) {
        if (!interaction.guild || !interaction.member)
            return;
        const member = interaction.options.getMember('user') ?? interaction.member;
        if (!(member instanceof GuildMember))
            return;
        return interaction.reply({
            embeds: [
                await this.getEmbed(member)
            ]
        });
    }
    async contextMenuRun(interaction) {
        if (!interaction.guild || !interaction.member || !interaction.isUserContextMenuCommand())
            return;
        const member = interaction.targetMember;
        if (!(member instanceof GuildMember))
            return;
        return interaction.reply({ ephemeral: true,
            embeds: [
                await this.getEmbed(member)
            ]
        });
    }
    async getEmbed(member) {
        const { counting_counts } = await this.db.fetchMember(member);
        const { counting_count } = await this.db.fetchGuild(member.guild);
        return new EmbedBuilder()
            .setTitle('Counting Stats')
            .setDescription(`${member} has counted \`${counting_counts}\` times.\nThat's \`${percentage(counting_counts, counting_count, 2)}\` of total counts.`)
            .setThumbnail(member.displayAvatarURL());
    }
};
CountingCommand = __decorate([
    ApplyOptions({
        name: 'counting',
        description: 'View counting stats'
    })
], CountingCommand);
export { CountingCommand };
//# sourceMappingURL=counting.js.map