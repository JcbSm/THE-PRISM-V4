import { HangmanWord } from "./HangmanWord";
/**
 * Represents a HangmanPhrase
 */
export declare class HangmanPhrase {
    /**
     * The original string
     */
    phrase: String;
    /**
     * The HangmanWords that make up the phrase
     */
    words: HangmanWord[];
    /**
     * Creates a new HangmanPhrase from a String
     * @param phrase The phrase to display
     */
    constructor(phrase: String);
    /**
     * Checks if the word has been guessed
     */
    get guessed(): boolean;
    /**
     * Guesses the entire phrase
     * @param phrase The phrase to guess
     * @returns If the guess was correct
     */
    guess(phrase: String): boolean;
    /**
     * Guesses a character, and checks all the letters in all the words
     * @param char The character to guess
     * @returns If the guess was correct
     */
    guessCharacter(char: String): boolean;
    /**
     * Turn the HangmanPhrase into a string
     * @returns The phrase as it would appear in hangman
     */
    toString(): String;
}
//# sourceMappingURL=HangmanPhrase.d.ts.map