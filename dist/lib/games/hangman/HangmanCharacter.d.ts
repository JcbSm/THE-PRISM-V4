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
//# sourceMappingURL=HangmanCharacter.d.ts.map