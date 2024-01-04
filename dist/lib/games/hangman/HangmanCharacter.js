/**
 * Represents a character
 */
export class HangmanCharacter {
    /**
     * The Character
     */
    char;
    /**
     * If the character has been guessed
     */
    guessed;
    /**
     * Creates a new HangmanCharacter
     * @param char The character
     */
    constructor(char) {
        this.char = char.toUpperCase();
        this.guessed = false;
    }
    /**
     * Guesses a character
     * @param char The character to match
     * @returns If the guess was correct.
     */
    guess(char) {
        const before = this.guessed;
        if (this.char.toUpperCase() === char)
            this.guessed = true;
        return this.guessed != before;
    }
    /**
     * Turns the character into a String
     * @returns If guessed, the character, if not guessed, an underscore.
     */
    toString() {
        return this.guessed ? this.char : "\\_";
    }
}
//# sourceMappingURL=HangmanCharacter.js.map