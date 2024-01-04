import { createCanvas, registerFont } from "canvas";
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
/**
 * Create HangmanGame
 */
export class HangmanGame {
    reply;
    letters = [
        [
            'A', 'B', 'C', 'D', 'E',
            'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O',
        ],
        [
            'P', 'Q', 'R', 'S',
            'T', 'U', 'V', 'W',
            'X', 'Y', 'Z'
        ]
    ];
    guessed = new Set();
    /**
     * Creates a new HangmanGame
     * @param phrase The phrase
     */
    constructor(phrase) {
        // Set the phrase
        this.phrase = phrase;
        // Initialise lives to 9
        this.lives = 9;
        this.reply = null;
    }
    guessCharacter(char) {
        // Guess the character
        const correct = this.phrase.guessCharacter(char);
        // Add the character to the set of guessed characters
        this.guessed.add(char);
        // Decremenet lives if incorrect
        if (!correct)
            this.lives--;
        return correct;
    }
    /**
     * Starts the game
     * @param interaction The interaction to reply to
     */
    async start(interaction) {
        this.reply = await interaction.reply({
            fetchReply: true,
            files: [
                new AttachmentBuilder(this.draw(this.lives))
                    .setName(`image_${this.lives}.png`)
            ],
            embeds: [
                this.getEmbed()
            ],
            components: this.getComponents()
        });
        // Create a collector for the button interactions
        this.reply.createMessageComponentCollector({ filter: (i) => i.isButton() && i.user.id === interaction.user.id })
            .on('collect', async (interaction) => {
            if (interaction.customId == 'hangmanGuessLetter') {
                const guessMsg = await interaction.reply({ ...this.getGuessMessageOptions(0), fetchReply: true });
                let page = 0;
                guessMsg.createMessageComponentCollector({ filter: (i) => i.isButton() })
                    .on('collect', async (i) => {
                    if (i.customId == 'hangmanGuessLetterNext') {
                        page = 1;
                    }
                    else if (i.customId == 'hangmanGuessLetterPrevious') {
                        page = 0;
                    }
                    else if (i.customId.startsWith('hangmanGuessLetter_')) {
                        this.guessCharacter(i.customId.charAt(19));
                        this.reply?.edit(this.getMessageOptions());
                    }
                    i.update(this.getGuessMessageOptions(page));
                });
            }
            else if (interaction.customId == 'hangmanGuessPhrase') {
                await interaction.showModal(new ModalBuilder()
                    .setCustomId('hangmanGuessPhraseModal')
                    .setTitle('Guess the phrase')
                    .setComponents([
                    new ActionRowBuilder()
                        .setComponents([
                        new TextInputBuilder()
                            .setCustomId('hangmanGuessPhraseText')
                            .setLabel('Guess')
                            .setPlaceholder('Enter your guess here.')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    ])
                ]));
                const submitted = await interaction.awaitModalSubmit({
                    time: 60 * 1000
                });
                if (submitted) {
                    const guess = submitted.fields.getTextInputValue('hangmanGuessPhraseText');
                    const correct = this.phrase.guess(guess);
                    if (!correct)
                        this.lives = 0;
                    submitted.reply(this.getGuessMessageOptions(0));
                    this.reply?.edit(this.getMessageOptions());
                }
            }
        });
    }
    getGuessMessageOptions(page) {
        if (this.lives == 0) {
            return { ephemeral: true, content: "💀 RIP", components: [] };
        }
        else if (this.phrase.guessed) {
            return { ephemeral: true, content: "🎉🎉🎉 YAY!", components: [] };
        }
        else {
            return {
                ephemeral: true,
                content: 'Select a letter to guess',
                components: this.getGuessComponents(page)
            };
        }
    }
    getGuessComponents(page) {
        if (page == 0) {
            const buttons = this.letters[0].map((c) => {
                return new ButtonBuilder()
                    .setCustomId(`hangmanGuessLetter_${c}`)
                    .setLabel(c)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(this.guessed.has(c));
            });
            return [
                new ActionRowBuilder()
                    .setComponents(buttons.slice(0, 5)),
                new ActionRowBuilder()
                    .setComponents(buttons.slice(5, 10)),
                new ActionRowBuilder()
                    .setComponents(buttons.slice(10, 15)),
                new ActionRowBuilder()
                    .setComponents([
                    new ButtonBuilder()
                        .setCustomId('hangmanGuessLetterNext')
                        .setLabel('More letters')
                        .setEmoji('➡️')
                        .setStyle(ButtonStyle.Primary)
                ])
            ];
        }
        else {
            const buttons = this.letters[1].map((c) => {
                return new ButtonBuilder()
                    .setCustomId(`hangmanGuessLetter_${c}`)
                    .setLabel(c)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(this.guessed.has(c));
            });
            return [
                new ActionRowBuilder()
                    .setComponents(buttons.slice(0, 4)),
                new ActionRowBuilder()
                    .setComponents(buttons.slice(4, 8)),
                new ActionRowBuilder()
                    .setComponents(buttons.slice(8, 12)),
                new ActionRowBuilder()
                    .setComponents([
                    new ButtonBuilder()
                        .setCustomId('hangmanGuessLetterPrevious')
                        .setLabel('Back')
                        .setEmoji('⬅️')
                        .setStyle(ButtonStyle.Primary)
                ])
            ];
        }
    }
    getMessageOptions() {
        return {
            files: [
                new AttachmentBuilder(this.draw(this.lives))
                    .setName(`image_${this.lives}.png`)
            ],
            embeds: [
                this.getEmbed()
            ],
            components: this.getComponents()
        };
    }
    getComponents() {
        return this.phrase.guessed || this.lives == 0
            ? []
            : [
                new ActionRowBuilder()
                    .setComponents([
                    new ButtonBuilder()
                        .setCustomId('hangmanGuessLetter')
                        .setLabel('Guess Letter')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('hangmanGuessPhrase')
                        .setLabel('Guess Phrase')
                        .setStyle(ButtonStyle.Danger)
                ])
            ];
    }
    getEmbed() {
        return new EmbedBuilder()
            .setTitle((this.lives == 0 ? this.phrase.phrase.toUpperCase() : this.phrase.toString()))
            .setImage(`attachment://image_${this.lives}.png`)
            .setDescription(`Guesses: \n${[...this.guessed].map((c) => {
            return `\`${c}\``;
        }).join(" ")}`)
            .setColor(this.phrase.guessed ? Colors.DarkGreen : this.lives == 0 ? Colors.Red : null);
    }
    /**
     * Draw the game.
     * @returns
     */
    draw(lives) {
        registerFont('./src/assets/fonts/impact.ttf', { family: 'impact' });
        const canvas = createCanvas(400, 200);
        const ctx = canvas.getContext('2d');
        let lineWidth = canvas.width / 100;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - lineWidth / 2);
        ctx.lineTo(canvas.width, canvas.height - lineWidth / 2);
        switch (lives) {
            // @ts-ignore
            case 0:
                ctx.moveTo(canvas.width / 3, 3 * canvas.height / 5);
                ctx.lineTo(canvas.width / 3 + canvas.width / 20, 7 * canvas.height / 8);
            // @ts-ignore
            case 1:
                ctx.moveTo(canvas.width / 3, 3 * canvas.height / 5);
                ctx.lineTo(canvas.width / 3 - canvas.width / 20, 7 * canvas.height / 8);
            // @ts-ignore
            case 2:
                ctx.moveTo(canvas.width / 3, 9 * canvas.height / 25);
                ctx.lineTo(canvas.width / 3 + canvas.width / 20, canvas.height / 2);
            // @ts-ignore
            case 3:
                ctx.moveTo(canvas.width / 3, 9 * canvas.height / 25);
                ctx.lineTo(canvas.width / 3 - canvas.width / 20, canvas.height / 2);
            // @ts-ignore
            case 4:
                ctx.moveTo(canvas.width / 3, canvas.height / 8 + 2 * canvas.height / 12);
                ctx.lineTo(canvas.width / 3, 3 * canvas.height / 5);
            // @ts-ignore
            case 5:
                ctx.moveTo(canvas.width / 3, canvas.height / 8);
                ctx.arc(canvas.width / 3, canvas.height / 8 + canvas.height / 12, canvas.height / 12, -Math.PI / 2, 3 * Math.PI / 2);
            // @ts-ignore
            case 6:
                ctx.moveTo(canvas.width / 3, 0);
                ctx.lineTo(canvas.width / 3, canvas.height / 8);
            // @ts-ignore
            case 7:
                ctx.moveTo(canvas.width / 15, canvas.height / 5);
                ctx.lineTo(canvas.width / 15 + canvas.height / 5, lineWidth / 2);
            // @ts-ignore
            case 8:
                ctx.moveTo(canvas.width / 15, lineWidth / 2);
                ctx.lineTo(canvas.width / 2.7, lineWidth / 2);
            case 9:
                ctx.moveTo(canvas.width / 15, canvas.height);
                ctx.lineTo(canvas.width / 15, 0);
        }
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        if (lives === 0) {
            let str = 'RIP.';
            ctx.font = `${canvas.height / 3}px "impact"`;
            ctx.strokeStyle = '#000';
            ctx.lineWidth = lineWidth * 1.5;
            ctx.strokeText(str, canvas.width / 1.8, 3 * canvas.height / 5);
            ctx.fillStyle = '#fff';
            ctx.fillText(str, canvas.width / 1.8, 3 * canvas.height / 5);
        }
        ;
        return canvas.toBuffer();
    }
}
//# sourceMappingURL=HangmanGame.js.map