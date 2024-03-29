import { PrismCommand } from "#structs/PrismCommand";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder, User } from "discord.js";

@ApplyOptions<PrismCommand.Options>({
    name: 'rps',
    description: 'Play a game of rock paper scissors.'
})

export class RockPaperScissorsCommand extends PrismCommand {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(command =>
            command //
                .setName(this.name)
                .setDescription(this.description)
                .addUserOption(option =>
                    option //
                        .setName('opponent')
                        .setDescription('A user you would like to challenge')))
    }

    public override async chatInputRun(interaction: PrismCommand.ChatInputInteraction) {

        if (!interaction.guild) return;

        const user = interaction.user;
        const opponent = interaction.options.getUser('opponent');
        
        if (opponent) {

            if (user.id == opponent.id) return interaction.reply({ ephemeral: true, content: 'You can\'t play against yourself!' })
            
            await interaction.reply({ content: `${opponent}! You've been challenged to Rock Paper Scissors by ${user}.`, 
                allowedMentions: { users: [user.id, opponent.id]},
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .setComponents([
                            new ButtonBuilder()
                                .setCustomId('rpsAccept')
                                .setLabel('Accept')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('rpsDeny')
                                .setLabel('Deny')
                                .setStyle(ButtonStyle.Danger)
                        ])
            ]})

            const reply = await interaction.fetchReply();

            reply.awaitMessageComponent({ componentType: ComponentType.Button, filter: (interaction: ButtonInteraction) => interaction.user.id == opponent.id, time: 300*1000 }).then((interaction: ButtonInteraction) => {

                if (!interaction.channel) return;

                switch (interaction.customId) {
                    case 'rpsAccept':
                        this.rps(interaction, user, opponent);
                        break;
                    case 'rpsDeny':
                        interaction.deleteReply();
                        break;
                }

            }).catch(async () => {
                await interaction.editReply({ content: `${user}, your opponent didn't respond in time.`, components: [], allowedMentions: { users: [user.id] } });

                setTimeout(async () => {
                    await interaction.deleteReply().catch(() => {});
                }, 5 * 1000)
            })

        } else {

            await interaction.reply({ content: `${interaction.user} wants to play Rock Paper Scissors!`, allowedMentions: { users: [user.id]}, components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents([
                        new ButtonBuilder()
                            .setCustomId('rpsChallenge')
                            .setLabel('Challenge')
                            .setStyle(ButtonStyle.Danger)
                    ])
            ]})

            const reply = await interaction.fetchReply();

            reply.awaitMessageComponent({
                componentType: ComponentType.Button,
                filter: (i: ButtonInteraction) => i.user.id != user.id,
                time: 300*1000
            }).then(async (interaction: ButtonInteraction) => {
                if (!interaction.channel) return;
                this.rps(interaction, user, interaction.user);
            }).catch(async () => {
                await interaction.editReply({ content: `${interaction.user}, nobody wants to play with you :(...`, allowedMentions: { users: [user.id] }, components: []});
                setTimeout(async () => {
                    await interaction.deleteReply().catch(() => {});
                }, 5 * 1000);
            })
        }

        return;
    }

    private async rps(interaction: ButtonInteraction, user: User, opponent: User) {

        if (!interaction.guild) return;

        const msg = await interaction.update({ content: '\u200b',
            allowedMentions: { users: [user.id, opponent.id]},
            embeds: [
                new EmbedBuilder()
                    .setTitle('ROCK PAPER SCISSORS')
                    .setFields([
                        {
                            name: 'Challenger',
                            value: `${user}`,
                            inline: true
                        },
                        {
                            name: 'Opponent',
                            value: `${opponent}`,
                            inline: true
                        }
                    ])
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents([
                        new ButtonBuilder()
                            .setCustomId('rpsRock')
                            .setLabel('ROCK')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('rpsPaper')
                            .setLabel('PAPER')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('rpsScissors')
                            .setLabel('SCISSORS')
                            .setStyle(ButtonStyle.Danger)
                    ])
        ]})

        const responses = await Promise.all([
            new Promise(async (resolve: (res: number | null) => void) => {
                const res = await msg.awaitMessageComponent({ time: 60*1000, componentType: ComponentType.Button, filter: (interaction: ButtonInteraction) => interaction.user.id == user.id }).catch(() => null);
                await res?.update({})
                return res?.customId == 'rpsRock' ? resolve(0) : res?.customId == 'rpsPaper' ? resolve(1) : res?.customId == 'rpsScissors' ? resolve(2) : resolve(null);
            }),
            new Promise(async (resolve: (res: number | null) => void) => {
                const res = await msg.awaitMessageComponent({ time: 60*1000, componentType: ComponentType.Button, filter: (interaction: ButtonInteraction) => interaction.user.id == opponent.id }).catch(() => null);
                await res?.update({});
                return res?.customId == 'rpsRock' ? resolve(0) : res?.customId == 'rpsPaper' ? resolve(1) : res?.customId == 'rpsScissors' ? resolve(2) : resolve(null);
            }),
        ])

        const outcome = this.winner(responses);

        await interaction.editReply({ content: `***${outcome < 0 ? `WINNER: ${opponent}!` : outcome > 0 ? `WINNER: ${user}` : `DRAW`}***`,
            allowedMentions: { users: [user.id, opponent.id]},
            embeds: [
                new EmbedBuilder()
                    .setTitle('ROCK PAPER SCISSORS')
                    .setFields([
                        {
                            name: 'Challenger',
                            value: `${user}\n${responses[0] !== null ? ['🪨 ROCK', '📃 PAPER', '✂️ SCISSORS'][responses[0]] : 'No choice...'}`,
                            inline: true
                        },
                        {
                            name: 'Opponent',
                            value: `${opponent}\n${responses[1] !== null ? ['🪨 ROCK', '📃 PAPER', '✂️ SCISSORS'][responses[1]] : 'No choice...'}`,
                            inline: true
                        }
                    ])
            ],
            components: []
        })

        this.db.rps(interaction.guild, user, opponent, outcome);
    }

    private winner(responses: [number | null, number | null]) {

        if (responses[0] == null && responses[1] == null) {
            return 0
        } else if (responses[0] == null) {
            return -1
        } else if (responses[1] == null) {
            return 1
        } else return [[0, -1, 1], [1, 0, -1], [-1, 1, 0]][responses[0]][responses[1]];

    }
}