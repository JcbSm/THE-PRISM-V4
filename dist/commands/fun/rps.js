import { __decorate } from "tslib";
import { PrismCommand } from "#structs/PrismCommand";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
let RockPaperScissorsCommand = class RockPaperScissorsCommand extends PrismCommand {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(command => command //
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option => option //
            .setName('opponent')
            .setDescription('A user you would like to challenge')));
    }
    async chatInputRun(interaction) {
        if (!interaction.guild)
            return;
        const user = interaction.user;
        const opponent = interaction.options.getUser('opponent');
        if (opponent) {
            if (user.id == opponent.id)
                return interaction.reply({ ephemeral: true, content: 'You can\'t play against yourself!' });
            await interaction.reply({ content: `${opponent}! You've been challenged to Rock Paper Scissors by ${user}.`,
                allowedMentions: { users: [user.id, opponent.id] },
                components: [
                    new ActionRowBuilder()
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
                ] });
            const reply = await interaction.fetchReply();
            reply.awaitMessageComponent({ componentType: ComponentType.Button, filter: (interaction) => interaction.user.id == opponent.id, time: 300 * 1000 }).then((interaction) => {
                if (!interaction.channel)
                    return;
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
                    await interaction.deleteReply().catch(() => { });
                }, 5 * 1000);
            });
        }
        else {
            await interaction.reply({ content: `${interaction.user} wants to play Rock Paper Scissors!`, allowedMentions: { users: [user.id] }, components: [
                    new ActionRowBuilder()
                        .setComponents([
                        new ButtonBuilder()
                            .setCustomId('rpsChallenge')
                            .setLabel('Challenge')
                            .setStyle(ButtonStyle.Danger)
                    ])
                ] });
            const reply = await interaction.fetchReply();
            reply.awaitMessageComponent({
                componentType: ComponentType.Button,
                filter: (i) => i.user.id != user.id,
                time: 300 * 1000
            }).then(async (interaction) => {
                if (!interaction.channel)
                    return;
                this.rps(interaction, user, interaction.user);
            }).catch(async () => {
                await interaction.editReply({ content: `${interaction.user}, nobody wants to play with you :(...`, allowedMentions: { users: [user.id] }, components: [] });
                setTimeout(async () => {
                    await interaction.deleteReply().catch(() => { });
                }, 5 * 1000);
            });
        }
        return;
    }
    async rps(interaction, user, opponent) {
        if (!interaction.guild)
            return;
        const msg = await interaction.update({ content: '\u200b',
            allowedMentions: { users: [user.id, opponent.id] },
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
                new ActionRowBuilder()
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
            ] });
        const responses = await Promise.all([
            new Promise(async (resolve) => {
                const res = await msg.awaitMessageComponent({ time: 20 * 1000, componentType: ComponentType.Button, filter: (interaction) => interaction.user.id == user.id }).catch(() => null);
                await res?.update({});
                return res?.customId == 'rpsRock' ? resolve(0) : res?.customId == 'rpsPaper' ? resolve(1) : res?.customId == 'rpsScissors' ? resolve(2) : resolve(null);
            }),
            new Promise(async (resolve) => {
                const res = await msg.awaitMessageComponent({ time: 20 * 1000, componentType: ComponentType.Button, filter: (interaction) => interaction.user.id == opponent.id }).catch(() => null);
                await res?.update({});
                return res?.customId == 'rpsRock' ? resolve(0) : res?.customId == 'rpsPaper' ? resolve(1) : res?.customId == 'rpsScissors' ? resolve(2) : resolve(null);
            }),
        ]);
        const outcome = this.winner(responses);
        await interaction.editReply({ content: `***${outcome < 0 ? `WINNER: ${opponent}!` : outcome > 0 ? `WINNER: ${user}` : `DRAW`}***`,
            allowedMentions: { users: [user.id, opponent.id] },
            embeds: [
                new EmbedBuilder()
                    .setTitle('ROCK PAPER SCISSORS')
                    .setFields([
                    {
                        name: 'Challenger',
                        value: `${user}\n${responses[0] ? ['🪨 ROCK', '📃 PAPER', '✂️ SCISSORS'][responses[0]] : 'No choice...'}`,
                        inline: true
                    },
                    {
                        name: 'Opponent',
                        value: `${opponent}\n${responses[1] ? ['🪨 ROCK', '📃 PAPER', '✂️ SCISSORS'][responses[1]] : 'No choice...'}`,
                        inline: true
                    }
                ])
            ],
            components: []
        });
        this.db.rps(interaction.guild, user, opponent, outcome);
    }
    winner(responses) {
        if (responses[0] == null && responses[1] == null) {
            return 0;
        }
        else if (responses[0] == null) {
            return -1;
        }
        else if (responses[1] == null) {
            return 1;
        }
        else
            return [[0, -1, 1], [1, 0, -1], [-1, 1, 0]][responses[0]][responses[1]];
    }
};
RockPaperScissorsCommand = __decorate([
    ApplyOptions({
        name: 'rps',
        description: 'Play a game of rock paper scissors.'
    })
], RockPaperScissorsCommand);
export { RockPaperScissorsCommand };
//# sourceMappingURL=rps.js.map