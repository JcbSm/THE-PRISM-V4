import { HangmanWord } from "./HangmanWord";

/**
 * Represents a HangmanPhrase
 */
export class HangmanPhrase {
    
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
    constructor(phrase: String) {

        // Sets the original string
        this.phrase = phrase;

        // Splits up the phrase by every space and creates a HangmanWord with each split.
        this.words = phrase.split(" ").map(w => new HangmanWord(w));
    }

    /**
     * Checks if the word has been guessed
     */
    public get guessed(): boolean {

        // I hate this but it works
        // Returns NOT ( If some words have some characters that havent been guessed )
        return !this.words.some((w) => w.characters.some(c => !c.guessed));

    }

    /**
     * Guesses the entire phrase
     * @param phrase The phrase to guess
     * @returns If the guess was correct
     */
    public guess(phrase: String) {

        // Check if they're the same
        if (this.phrase.toUpperCase() == phrase.toUpperCase()) {

            // Iterate through the characters and set guessed to true
            this.words.forEach(w => w.characters.forEach(c => c.guessed = true));

            return true;

        } else 
            return false;

    }

    /**
     * Guesses a character, and checks all the letters in all the words
     * @param char The character to guess
     * @returns If the guess was correct
     */
    public guessCharacter(char: String) {
        let correct = false;

        // Iterate through words
        this.words.forEach((w) => {
            // Guess the character for each word
            if (w.guessCharacter(char)) {
                correct = true;
            }
        });

        // Return if the character was corect for any letter in any word
        return correct;
    }

    /**
     * Turn the HangmanPhrase into a string
     * @returns The phrase as it would appear in hangman
     */
    public toString() {
        
        // Join word by " / "
        return this.words.map((word) => word.toString()).join("  /  ") as String;

    }
}