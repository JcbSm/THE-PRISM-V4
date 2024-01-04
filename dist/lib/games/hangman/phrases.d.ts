/**
 * Represents a character
 */
export declare class HangmanCharacter {
    /**
     * The Character
     */
    char: String;
    /**
     * If the character has been guessed
     */
    guessed: boolean;
    /**
     * Creates a new HangmanCharacter
     * @param char The character
     */
    constructor(char: String);
    /**
     * Guesses a character
     * @param char The character to match
     * @returns If the guess was correct.
     */
    guess(char: String): boolean;
    /**
     * Turns the character into a String
     * @returns If guessed, the character, if not guessed, an underscore.
     */
    toString(): String;
}
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
    get guessed(): boolean;
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
//# sourceMappingURL=phrases.d.ts.map