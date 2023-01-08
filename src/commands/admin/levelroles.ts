import { getLevel } from "#helpers/xp";
import { PrismSubcommand } from "#structs/PrismSubcommand";
import type { RawDatabaseLevelRole } from "#types/database";
import { ApplyOptions } from "@sapphire/decorators";
import type { ChatInputCommand } from "@sapphire/framework";
import { ButtonInteraction, Guild, Message, ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder, ComponentType, ButtonStyle, GuildMember } from "discord.js";

@ApplyOptions<PrismSubcommand.Options>({
    name: 'levelroles',
    description: 'Manage level roles.',
    subcommands: [
        { name: 'add', chatInputRun: 'chatInputRunAdd' },
        { name: 'manage', chatInputRun: 'chatInputRunManage' }
    ],
    preconditions: ['Administrator']
})

export class LevelRolesCommand extends PrismSubcommand {

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
                .setName(this.name)
                .setDescription(this.description)

                .addSubcommand((command) =>

                    command //
                        .setName('add')
                        .setDescription('Add a new level role')
                        .addRoleOption((option) =>

                            option //
                                .setName('role')
                                .setDescription('Role to be awarded')
                                .setRequired(true))

                        .addIntegerOption((option) =>

                            option //
                                .setName('level')
                                .setDescription('The Level the role will be awarded at.')
                                .setMinValue(0)
                                .setMaxValue(150)
                                .setRequired(true)))

                .addSubcommand((command) =>

                    command //
                        .setName('manage')
                        .setDescription('List and/or remove levelroles')),

            {
                idHints: ['1061376823574933534']
            })
    }

    public async chatInputRunManage(interaction: PrismSubcommand.ChatInputCommandInteraction) {

        if (!interaction.guild)
            return;

        const guild = interaction.guild;

        await interaction.deferReply({ ephemeral: true });

        const msg = await interaction.editReply({ 
            embeds: [
                await this.listEmbed(guild)
            ],
            components: [
                await this.listButtons()
            ]
        }) as Message;

        // Remove button collector
        msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60 * 1000 })
            .on('collect', async (i: ButtonInteraction) => {

                if (i.customId == 'levelRoleRemove') {

                    // Disable button
                    await interaction.editReply({ components: [
                        this.listButtons(true)
                    ]});

                    // Send delete message
                    await i.reply({ ephemeral: true, content: 'Select which level roles you with to remove:', components: [
                        await this.deleteMenu(guild)
                    ]});

                    // Get reply
                    const reply = await i.fetchReply() as Message;
                    
                    // Wait for response
                    const res = await reply.awaitMessageComponent({ componentType: ComponentType.StringSelect, time: 60 * 1000}).catch(() => undefined);
                    
                    // No response
                    if (!res) {
                        i.editReply({ content: 'Time expired. You can dissmiss this message.', components: []});
                        return;
                    }

                    // Delete level roles
                    for (const id of res.values)
                        this.db.removeLevelRole(Number(id));

                    // Remove select menu
                    await i.editReply({ content: 'Level roles deleted. You can dissmiss this message.', components: [] });

                    // Update original embed
                    await interaction.editReply({ 
                        embeds: [
                            await this.listEmbed(guild)
                        ],
                        components: [
                            this.listButtons()
                        ]
                    })
                }

                else if (i.customId == 'levelRoleToggle') {

                    const { level_roles_stack } = await this.db.fetchGuild(guild);

                    await this.db.updateGuild(guild, { level_roles_stack: !level_roles_stack });
                    
                    await i.update({
                        embeds: [
                            await this.listEmbed(guild)
                        ]
                    })

                }

                else if (i.customId == 'levelRoleUpdateMembers') {

                    await i.reply({ content: 'This could take a while...' });

                    const members = await guild.members.fetch();
                    let n = 0;

                    for (const [,member] of members) {
                        i.editReply({ embeds: [
                            new EmbedBuilder()
                                .setTitle('Updating Member Level Roles')
                                .setDescription(`Updating roles for ${member}...`)
                                .addFields([
                                    {
                                        name: 'Progress...',
                                        value: `\`${Math.round(10000*(n++/members.size))/100}%\``
                                    }
                                ])
                        ]})
                        await this.updateMemberRoles(member);
                    }

                    await i.editReply({ content: "Done!\nThis message will delete in 10 seconds...", embeds: []});

                    setTimeout(() => {
                        i.deleteReply();
                    }, 10 * 1000)

                }

            })
            .on('end', () => {
                interaction.editReply({ components: [] })
            }) 
    }

    public async chatInputRunAdd(interaction: PrismSubcommand.ChatInputCommandInteraction) {

        if (!interaction.guild)
            return;

        const role = await interaction.guild.roles.fetch(interaction.options.getRole('role', true).id);

        if (!role)
            return;

        const level = interaction.options.getInteger('level', true);

        const levelrole = await this.db.addLevelRole(role, interaction.guild, level);

        return interaction.reply({ ephemeral: true, embeds: [
            {
                description: `Levelrole with ID: \`${levelrole.level_role_id}\` created.`,
                fields: [
                    {
                        name: 'Role',
                        value: `${role}`,
                        inline: true
                    },
                    {
                        name: 'Level',
                        value: `\`${level}\``,
                        inline: true
                    }
                ]
            }
        ] })
    }

    private async listEmbed(guild: Guild) {

        const levelRoles = (await this.db.getLevelRoles(guild)).sort((a, b) => b.level - a.level)
        const fields: { level: number, roles: RawDatabaseLevelRole[] }[] = [];
        const { level_roles_stack } = await this.db.fetchGuild(guild);

        for (const lr of levelRoles) {

            const i = fields.findIndex(f => f.level === lr.level);

            if (i >= 0) {
                fields[i].roles.push(lr);
            } else {
                fields.push({ level: lr.level, roles: [ lr ]})
            }
        }

        return new EmbedBuilder()
            .setDescription(`${level_roles_stack ? '☑' : '⬛'} - Stack previous level roles\n${!level_roles_stack ? '☑' : '⬛'} - Remove previous level roles`,)
            .setFields(fields.map(f => {
                return {
                    name: `Level ${f.level}`,
                    value: f.roles.map(r => `\`ID: ${r.level_role_id}\` <@&${r.role_id}>`).join("\n"),
                    inline: false
                }
            }))
    }

    private listButtons(disabled = false) {

        return new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
                new ButtonBuilder()
                    .setCustomId('levelRoleRemove')
                    .setLabel('Remove Level Role(s)')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('❌')
                    .setDisabled(disabled),
                new ButtonBuilder()
                    .setCustomId('levelRoleToggle')
                    .setLabel('Toggle stack type')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🏗️'),
                new ButtonBuilder()
                    .setCustomId('levelRoleUpdateMembers')
                    .setLabel('Update members')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🔁')
            ])
    }

    private async deleteMenu(guild: Guild) {

        const levelroles = (await this.db.getLevelRoles(guild)).sort((a, b) => b.level - a.level)

        return new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents([
                new StringSelectMenuBuilder()
                    .setPlaceholder('Select levelroles to remove...')
                    .setCustomId('levelRoleRemoveMenu')
                    .setMinValues(0)
                    .setMaxValues(levelroles.length)
                    .setOptions(levelroles.map(lr => {
                        return {
                            value: String(lr.level_role_id),
                            description: `Role ID: ${lr.role_id}`,
                            label: `ID: ${lr.level_role_id} | Level: ${lr.level}`
                        }
                    }))
            ])

    }

    private updateMemberRoles(member: GuildMember): Promise<null> {

        return new Promise(async (res) => {

            const { xp } = await this.db.fetchMember(member);
            const level = getLevel(xp);

            let levelRoles = (await this.db.getLevelRoles(member.guild)).sort((a, b) => b.level - a.level)

            let add: RawDatabaseLevelRole[] = []; let rem: RawDatabaseLevelRole[] = [];

            await member.fetch()

            if ((await this.db.fetchGuild(member.guild)).level_roles_stack) {

                add = levelRoles.filter(r => r.level <= level && !member.roles.cache.has(r.role_id));
                rem = levelRoles.filter(r => r.level > level && member.roles.cache.has(r.role_id));

            } else {

                const max = levelRoles.filter(r => r.level <= level)[0].level;

                add = levelRoles.filter(r => r.level === max && !member.roles.cache.has(r.role_id))
                rem = levelRoles.filter(r => r.level !== max && member.roles.cache.has(r.role_id))

            };
            
            // For some reason only this works
            for (const id of add.map(r => r.role_id)) {
                await member.roles.add(id);
            }
            for (const id of rem.map(r => r.role_id)) {
                await member.roles.remove(id);
            }

            return res(null);
        })
    }
}