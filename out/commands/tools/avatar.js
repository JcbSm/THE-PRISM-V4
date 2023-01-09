import { __decorate } from "tslib";
import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, GuildMember } from "discord.js";
let AvatarCommand = class AvatarCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder //
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption((option) => option //
            .setName('user')
            .setDescription('User\'s avatar to get')));
        registry.registerContextMenuCommand((builder) => builder //
            .setName(this.description)
            .setType(ApplicationCommandType.User));
    }
    chatInputRun(interaction) {
        if (!interaction.guild)
            return;
        const member = interaction.options.getMember('user') || interaction.member;
        if (member instanceof GuildMember) {
            this.reply(interaction, member);
        }
    }
    contextMenuRun(interaction) {
        if (!interaction.guild)
            return;
        if (interaction.isUserContextMenuCommand() && interaction.targetMember instanceof GuildMember) {
            const member = interaction.targetMember;
            this.reply(interaction, member, true);
        }
    }
    async reply(interaction, member, ephemeral = false) {
        let display = true;
        await interaction.reply({ ephemeral,
            embeds: this.embeds(member, true),
            components: this.components(member, true)
        });
        const reply = await interaction.fetchReply();
        reply.createMessageComponentCollector({ componentType: ComponentType.Button, filter: (i) => i.user.id == interaction.user.id })
            .on('collect', async (i) => {
            display = !display;
            await i.update({ embeds: this.embeds(member, display), components: this.components(member, display) });
        })
            .on('end', async () => {
            await interaction.editReply({ components: [] });
        });
    }
    embeds(member, display) {
        return [new EmbedBuilder()
                .setImage(display
                ? member.displayAvatarURL({ size: 1024, extension: 'png' })
                : member.user.displayAvatarURL({ size: 1024, extension: 'png' }))
        ];
    }
    components(member, display) {
        return member.displayAvatarURL() != member.user.displayAvatarURL()
            ? [new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                    .setCustomId('avatarSwitch')
                    .setLabel(display ? 'View user avatar' : 'View server profile avatar')
                    .setStyle(ButtonStyle.Secondary))]
            : [];
    }
};
AvatarCommand = __decorate([
    ApplyOptions({
        name: 'avatar',
        description: 'View avatar'
    })
], AvatarCommand);
export { AvatarCommand };
//# sourceMappingURL=avatar.js.map