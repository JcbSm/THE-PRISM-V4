/// <reference types="node" />
import type { HangmanPhrase } from "./phrases";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, InteractionEditReplyOptions, Message } from "discord.js";
import type { PrismCommand } from "#structs/PrismCommand";
export interface HangmanGame {
    phrase: HangmanPhrase;
    lives: number;
}
/**
 * Create HangmanGame
 */
export declare class HangmanGame {
    reply: Message | null;
    letters: string[][];
    guessed: Set<String>;
    /**
     * Creates a new HangmanGame
     * @param phrase The phrase
     */
    constructor(phrase: HangmanPhrase);
    guessCharacter(char: String): boolean;
    /**
     * Starts the game
     * @param interaction The interaction to reply to
     */
    start(interaction: PrismCommand.ChatInputInteraction): Promise<void>;
    getGuessMessageOptions(page: number): {
        ephemeral: boolean;
        content: string;
        components: ActionRowBuilder<ButtonBuilder>[];
    };
    getGuessComponents(page: number): ActionRowBuilder<ButtonBuilder>[];
    getMessageOptions(): InteractionEditReplyOptions;
    getComponents(): ActionRowBuilder<ButtonBuilder>[];
    getEmbed(): EmbedBuilder;
    /**
     * Draw the game.
     * @returns
     */
    draw(lives: number): Buffer;
}
//# sourceMappingURL=HangmanGame.d.ts.map