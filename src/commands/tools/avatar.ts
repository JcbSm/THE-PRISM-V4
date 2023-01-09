import { PrismCommand } from "#structs/PrismCommand";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, ChatInputCommand, ContextMenuCommand } from "@sapphire/framework";
import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder, GuildMember } from "discord.js";

@ApplyOptions<PrismCommand.Options>({
    name: 'avatar',
    description: 'View avatar'
})

export class AvatarCommand extends PrismCommand {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand((builder) => 
            builder //
                .setName(this.name)
                .setDescription(this.description)
                .addUserOption((option) =>
                    option //
                        .setName('user')
                        .setDescription('User\'s avatar to get')))

        registry.registerContextMenuCommand((builder) => 
            builder //
                .setName(this.description)
                .setType(ApplicationCommandType.User))
    }

    public override chatInputRun(interaction: ChatInputCommand.Interaction) {

        if (!interaction.guild) 
            return;

        const member = interaction.options.getMember('user') || interaction.member;
        
        if (member instanceof GuildMember) {
            this.reply(interaction, member);
        }

    }

    public override contextMenuRun(interaction: ContextMenuCommand.Interaction) {

        if (!interaction.guild)
            return;

        if (interaction.isUserContextMenuCommand() && interaction.targetMember instanceof GuildMember) {
            const member = interaction.targetMember;
            this.reply(interaction, member, true)
        }
    }

    private async reply(interaction: ChatInputCommand.Interaction | ContextMenuCommand.Interaction, member: GuildMember, ephemeral = false) {

        let display = true;

        await interaction.reply({ ephemeral, 
            embeds: this.embeds(member, true),
            components: this.components(member, true)
        })

        const reply = await interaction.fetchReply();

        reply.createMessageComponentCollector({ componentType: ComponentType.Button, filter: (i: ButtonInteraction) => i.user.id == interaction.user.id })
            .on('collect', async (i: ButtonInteraction) => {
                display = !display;
                await i.update({ embeds: this.embeds(member, display), components: this.components(member, display)})
            })
            .on('end', async () => {
                await interaction.editReply({ components: []})
            })
    }

    private embeds(member: GuildMember, display: boolean) {
        return [ new EmbedBuilder()
            .setImage(display
                ? member.displayAvatarURL({ size : 1024, extension: 'png' })
                : member.user.displayAvatarURL({ size: 1024, extension: 'png' }))
        ]
    }

    private components(member: GuildMember, display: boolean) {
        return member.displayAvatarURL() != member.user.displayAvatarURL()
        ? [new ActionRowBuilder<ButtonBuilder>()
            .addComponents(new ButtonBuilder()
                .setCustomId('avatarSwitch')
                .setLabel(display ? 'View user avatar' : 'View server profile avatar')
                .setStyle(ButtonStyle.Secondary))]
        : []
    }
}