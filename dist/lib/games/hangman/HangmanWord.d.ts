import { HangmanCharacter } from "./HangmanCharacter";
/**
 * Represents a word
 */
export declare class HangmanWord {
    /**
     * The characters in the word
     */
    characters: HangmanCharacter[];
    /**
     * Creates a new HangmanWord
     * @param word The word to parse
     */
    constructor(word: String);
    /**
     * Guesses a character in the word
     * @param char The character to guess
     * @returns If the guess was correct
     */
    guessCharacter(char: String): boolean;
    /**
     * Turn the HangmanWord into a string
     * @returns The word displayed as it would in Hangman
     */
    toString(): String;
}
//# sourceMappingURL=HangmanWord.d.ts.map