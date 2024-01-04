import { HangmanCharacter } from "./HangmanCharacter";
/**
 * Represents a word
 */
export class HangmanWord {
    /**
     * The characters in the word
     */
    characters;
    /**
     * Creates a new HangmanWord
     * @param word The word to parse
     */
    constructor(word) {
        // Splits the word by every character, and turns each character into a HangmanCharacter
        this.characters = word.split("").map(c => new HangmanCharacter(c));
    }
    /**
     * Guesses a character in the word
     * @param char The character to guess
     * @returns If the guess was correct
     */
    guessCharacter(char) {
        let correct = false;
        // Iterate through characers
        this.characters.forEach((c) => {
            // Guess the character
            if (c.guess(char)) {
                // Set correct to true if the guess was correct
                correct = true;
            }
        });
        // Return if they got any letters right
        return correct;
    }
    /**
     * Turn the HangmanWord into a string
     * @returns The word displayed as it would in Hangman
     */
    toString() {
        // Map my character, with space
        return this.characters.map((char) => char.toString()).join("  ");
    }
}
//# sourceMappingURL=HangmanWord.js.map