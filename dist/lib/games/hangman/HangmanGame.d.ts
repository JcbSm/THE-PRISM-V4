/// <reference types="node" />
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, InteractionEditReplyOptions, Message } from "discord.js";
import type { PrismCommand } from "#structs/PrismCommand";
import type { HangmanPhrase } from "#lib/games/hangman/HangmanPhrase";
export interface HangmanGame {
    phrase: HangmanPhrase;
    lives: number;
}
/**
 * Create HangmanGame
 */
export declare class HangmanGame {
    /**
     * The reply message
     */
    reply: Message | null;
    /**
     * List of letters that can be guessed,
     * split by button rows
     */
    letters: string[][];
    /**
     * The set of guessed letters
     */
    guessed: Set<String>;
    /**
     * Creates a new HangmanGame
     * @param phrase The phrase
     */
    constructor(phrase: HangmanPhrase);
    /**
     * Guesses a character
     * @param char The character to guess
     * @returns If the guess was correct or not.
     */
    guessCharacter(char: String): boolean;
    /**
     * Starts the game
     * @param interaction The interaction to reply to
     */
    start(interaction: PrismCommand.ChatInputInteraction): Promise<void>;
    /**
     * Displays a list of letters to pick to guess
     * @param page The page to view
     * @returns MessageOptions for the guess message
     *          or if the game is over, a separate message
     */
    getGuessMessageOptions(page: number): {
        ephemeral: boolean;
        content: string;
        components: ActionRowBuilder<ButtonBuilder>[];
    };
    /**
     * Get the components for the guessing
     * @param page The page to display
     * @returns Rows of buttons A-O or P-Z
     */
    getGuessComponents(page: number): ActionRowBuilder<ButtonBuilder>[];
    /**
     * Get the message options for the main message
     * @returns The MessageOptions for the main message
     */
    getMessageOptions(): InteractionEditReplyOptions;
    /**
     * Gets the components for the main message
     * @returns A list of components for the message
     */
    getComponents(): ActionRowBuilder<ButtonBuilder>[];
    /**
     * Gets the embed that reflects the current game state
     * @returns The Embed containing the image
     */
    getEmbed(): EmbedBuilder;
    /**
     * Draw the game.
     * @returns
     */
    draw(lives: number): Buffer;
}
//# sourceMappingURL=HangmanGame.d.ts.map