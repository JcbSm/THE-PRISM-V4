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
        this.characters.forEach((c) => {
            let g = c.guess(char);
            if (g) {
                correct = true;
            }
        });
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
/**
 * Represents a HangmanPhrase
 */
export class HangmanPhrase {
    /**
     * The original string
     */
    phrase;
    /**
     * The HangmanWords that make up the phrase
     */
    words;
    /**
     * Creates a new HangmanPhrase from a String
     * @param phrase The phrase to display
     */
    constructor(phrase) {
        // Sets the original string
        this.phrase = phrase;
        // Splits up the phrase by every space and creates a HangmanWord with each split.
        this.words = phrase.split(" ").map(w => new HangmanWord(w));
    }
    get guessed() {
        return !this.words.some((w) => w.characters.some(c => !c.guessed));
    }
    guess(phrase) {
        if (this.phrase.toUpperCase() == phrase.toUpperCase()) {
            this.words.forEach(w => w.characters.forEach(c => c.guessed = true));
            return true;
        }
        else
            return false;
    }
    /**
     * Guesses a character, and checks all the letters in all the words
     * @param char The character to guess
     * @returns If the guess was correct
     */
    guessCharacter(char) {
        let correct = false;
        this.words.forEach((w) => {
            let g = w.guessCharacter(char);
            if (g) {
                correct = true;
            }
        });
        return correct;
    }
    /**
     * Turn the HangmanPhrase into a string
     * @returns The phrase as it would appear in hangman
     */
    toString() {
        // Join word by " / "
        return this.words.map((word) => word.toString()).join("  /  ");
    }
}
//# sourceMappingURL=phrases.js.map