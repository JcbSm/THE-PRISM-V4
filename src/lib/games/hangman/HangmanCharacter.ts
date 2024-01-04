/**
 * Represents a character
 */
export class HangmanCharacter {

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
    constructor(char: String) {
        this.char = char.toUpperCase();
        this.guessed = false;
    }

    /**
     * Guesses a character
     * @param char The character to match
     * @returns If the guess was correct.
     */
    public guess(char: String): boolean {
        const before = this.guessed;
        if (this.char.toUpperCase() === char) this.guessed = true;
        return this.guessed != before;
    }

    /**
     * Turns the character into a String
     * @returns If guessed, the character, if not guessed, an underscore.
     */
    public toString(): String {
        return this.guessed ? this.char : "\\_";
    }
}
