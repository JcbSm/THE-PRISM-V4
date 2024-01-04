import { createCanvas, registerFont } from "canvas";
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Colors, EmbedBuilder, Interaction, InteractionEditReplyOptions, Message, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import type { PrismCommand } from "#structs/PrismCommand";
import type { HangmanPhrase } from "#lib/games/hangman/HangmanPhrase";

export interface HangmanGame {
    phrase: HangmanPhrase;
    lives: number;
}

/**
 * Create HangmanGame
 */
export class HangmanGame {

    /**
     * The reply message
     */
    reply: Message | null;

    /**
     * List of letters that can be guessed,
     * split by button rows
     */
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

    /**
     * The set of guessed letters
     */
    guessed: Set<String> = new Set();

    /**
     * Creates a new HangmanGame
     * @param phrase The phrase
     */
    constructor(phrase: HangmanPhrase) {

        // Set the phrase
        this.phrase = phrase;

        // Initialise lives to 9
        this.lives = 9;

        this.reply = null;
    }

    /**
     * Guesses a character
     * @param char The character to guess
     * @returns If the guess was correct or not.
     */
    public guessCharacter(char: String) {

        // Guess the character
        const correct = this.phrase.guessCharacter(char);
        // Add the character to the set of guessed characters
        this.guessed.add(char)

        // Decremenet lives if incorrect
        if (!correct) this.lives--;

        return correct;

    }

    /**
     * Starts the game
     * @param interaction The interaction to reply to
     */
    public async start(interaction: PrismCommand.ChatInputInteraction): Promise<void> {

        // Send the initial message
        this.reply = await interaction.reply({ fetchReply: true,
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
        this.reply.createMessageComponentCollector({ filter: (i: Interaction) => i.isButton() && i.user.id === interaction.user.id })

            // When the collector collects an interaction (button press)
            .on('collect', async (interaction: ButtonInteraction) => {

                // If they pressed the Guess Letter button
                if (interaction.customId == 'hangmanGuessLetter') {

                    let page = 0;  
                    // Send the guessing message                  
                    const guessMsg = await interaction.reply({ ...this.getGuessMessageOptions(page), fetchReply: true })

                    // And collect interactions
                    guessMsg.createMessageComponentCollector({ filter: (i: Interaction) => i.isButton() })
                        .on('collect', async (i: ButtonInteraction) => {

                            // Handle changing pages
                            if (i.customId == 'hangmanGuessLetterNext') {
                                page = 1;
                            } else if (i.customId == 'hangmanGuessLetterPrevious') {
                                page = 0;

                            // If they guess a letter
                            } else if (i.customId.startsWith('hangmanGuessLetter_')) {

                                // Get the letter they guess, and guess it
                                this.guessCharacter(i.customId.charAt(19));

                                // Update the main reply to reflect the guess
                                this.reply?.edit(this.getMessageOptions());

                            }

                            // Update the guessing message
                            i.update(this.getGuessMessageOptions(page));

                        })                

                // Else if they pressed the Guess Phrase buttonp
                } else if (interaction.customId == 'hangmanGuessPhrase') {

                    // Show the guess phrase modal
                    await interaction.showModal(
                        new ModalBuilder()
                            .setCustomId('hangmanGuessPhraseModal')
                            .setTitle('Guess the phrase')
                            .setComponents([
                                new ActionRowBuilder<TextInputBuilder>()
                                    .setComponents([
                                        new TextInputBuilder()
                                            .setCustomId('hangmanGuessPhraseText')
                                            .setLabel('Guess')
                                            .setPlaceholder('Enter your guess here.')
                                            .setStyle(TextInputStyle.Short)
                                            .setRequired(true)
                                    ])
                            ])
                    )

                    // Give them 60 seconds to submit
                    const submitted = await interaction.awaitModalSubmit({
                        time: 60 * 1000
                    })

                    if (submitted) {

                        // Get the guess
                        const guess = submitted.fields.getTextInputValue('hangmanGuessPhraseText');

                        // Attempt the guess
                        const correct = this.phrase.guess(guess);

                        // If incorrect, kill themselves
                        if (!correct) this.lives = 0;

                        // Reply to the submission
                        submitted.reply(this.getGuessMessageOptions(0));

                        // Reflect update in main message
                        this.reply?.edit(this.getMessageOptions());

                    }

                }
            })

    }

    /**
     * Displays a list of letters to pick to guess
     * @param page The page to view
     * @returns MessageOptions for the guess message
     *          or if the game is over, a separate message
     */
    public getGuessMessageOptions(page: number) {

        if (this.lives == 0) {

            return { ephemeral: true, content: "💀 RIP", components: [] }

        } else if (this.phrase.guessed) {
            return { ephemeral: true, content: "🎉🎉🎉 YAY!", components: [] }
        } else {
            return {
                ephemeral: true,
                content: 'Select a letter to guess',
                components: this.getGuessComponents(page)
            }
        }

    }

    /**
     * Get the components for the guessing
     * @param page The page to display
     * @returns Rows of buttons A-O or P-Z
     */
    public getGuessComponents(page: number): ActionRowBuilder<ButtonBuilder>[] {
        
        if (page == 0) {

            // Map letters into buttons
            const buttons = this.letters[0].map((c) => {
                return new ButtonBuilder()
                    .setCustomId(`hangmanGuessLetter_${c}`)
                    .setLabel(c)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(this.guessed.has(c));
            })

            // Split up the array of buttons into rows of 5
            return [
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents(buttons.slice(0, 5)),
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents(buttons.slice(5, 10)),
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents(buttons.slice(10, 15)),
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents([
                        new ButtonBuilder()
                            .setCustomId('hangmanGuessLetterNext')
                            .setLabel('More letters')
                            .setEmoji('➡️')
                            .setStyle(ButtonStyle.Primary)
                    ])
            ]

        } else {

            // Map the letters into buttons
            const buttons = this.letters[1].map((c) => {
                return new ButtonBuilder()
                    .setCustomId(`hangmanGuessLetter_${c}`)
                    .setLabel(c)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(this.guessed.has(c));
            })

            // Split the list into rows of 4
            return [
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents(buttons.slice(0, 4)),
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents(buttons.slice(4, 8)),
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents(buttons.slice(8, 12)),
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents([
                        new ButtonBuilder()
                            .setCustomId('hangmanGuessLetterPrevious')
                            .setLabel('Back')
                            .setEmoji('⬅️')
                            .setStyle(ButtonStyle.Primary)
                    ])
            ]

        }
    }

    /**
     * Get the message options for the main message
     * @returns The MessageOptions for the main message
     */
    public getMessageOptions(): InteractionEditReplyOptions {

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

    /**
     * Gets the components for the main message
     * @returns A list of components for the message
     */
    public getComponents() {

        // If the game is over, return empty list, otherwise
        return this.phrase.guessed || this.lives == 0
            ? []
            : [
                new ActionRowBuilder<ButtonBuilder>()
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
            ]

    }

    /**
     * Gets the embed that reflects the current game state
     * @returns The Embed containing the image
     */
    public getEmbed() {

        return new EmbedBuilder()
            .setTitle((this.lives == 0 ? this.phrase.phrase.toUpperCase() : this.phrase.toString()) as string)
            .setImage(`attachment://image_${this.lives}.png`)
            .setDescription(`Guesses: \n${[...this.guessed].map((c) => {
                return `\`${c}\``
            }).join(" ")}`)
            .setColor(this.phrase.guessed ? Colors.DarkGreen : this.lives == 0 ? Colors.Red : null)

    }

    /**
     * Draw the game.
     * @returns 
     */
    public draw(lives: number): Buffer {

        // Register meme font lol
        registerFont('./src/assets/fonts/impact.ttf', {family: 'impact'})

        // Create canvas and context
        const canvas = createCanvas(400, 200);
        const ctx = canvas.getContext('2d');

        let lineWidth = canvas.width/100;

        // Begin the path
        ctx.beginPath();

        // Draw the base
        ctx.moveTo(0, canvas.height - lineWidth/2);
        ctx.lineTo(canvas.width, canvas.height - lineWidth/2);

        // Depending on how many lives the user has, draw the hangman
        switch (lives) {
            // @ts-ignore
            case 0:
                ctx.moveTo(canvas.width/3, 3*canvas.height/5); // Draw a leg
                ctx.lineTo(canvas.width/3 + canvas.width/20, 7*canvas.height/8);
            // @ts-ignore
            case 1:
                ctx.moveTo(canvas.width/3, 3*canvas.height/5); // Draw a leg
                ctx.lineTo(canvas.width/3 - canvas.width/20, 7*canvas.height/8);
            // @ts-ignore
            case 2:
                ctx.moveTo(canvas.width/3, 9*canvas.height/25); // Draw an arm
                ctx.lineTo(canvas.width/3 + canvas.width/20, canvas.height/2)
            // @ts-ignore
            case 3:
                ctx.moveTo(canvas.width/3, 9*canvas.height/25); // Draw an arm
                ctx.lineTo(canvas.width/3 - canvas.width/20, canvas.height/2)
            // @ts-ignore
            case 4:
                ctx.moveTo(canvas.width/3, canvas.height/8 + 2*canvas.height/12); // Draw the body
                ctx.lineTo(canvas.width/3, 3*canvas.height/5);
            // @ts-ignore
            case 5:
                ctx.moveTo(canvas.width/3, canvas.height/8) // Draw the head
                ctx.arc(canvas.width/3, canvas.height/8 + canvas.height/12, canvas.height/12, -Math.PI/2, 3*Math.PI/2);
            // @ts-ignore
            case 6:
                ctx.moveTo(canvas.width/3, 0);  // Draw the rope
                ctx.lineTo(canvas.width/3, canvas.height/8)
            // @ts-ignore
            case 7:
                ctx.moveTo(canvas.width/15, canvas.height/5); // Draw the support
                ctx.lineTo(canvas.width/15 + canvas.height/5, lineWidth/2);
            // @ts-ignore
            case 8:
                ctx.moveTo(canvas.width/15, lineWidth/2); // Draw the top bar
                ctx.lineTo(canvas.width/2.7, lineWidth/2);
            case 9:
                ctx.moveTo(canvas.width/15, canvas.height); // Draw the post
                ctx.lineTo(canvas.width/15, 0);
        }

        // Stroke the lines that have been drawn with white
        ctx.strokeStyle = '#fff'; ctx.lineWidth = lineWidth;
        ctx.stroke();

        // If the player dead, draw the RIP
        if (lives === 0) {
            let str = 'RIP.'
            ctx.font = `${canvas.height/3}px "impact"`;
            ctx.strokeStyle = '#000'; ctx.lineWidth = lineWidth*1.5
            ctx.strokeText(str, canvas.width/1.8, 3*canvas.height/5);
            ctx.fillStyle = '#fff'
            ctx.fillText(str, canvas.width/1.8, 3*canvas.height/5);
        };

        return canvas.toBuffer()

    }
}