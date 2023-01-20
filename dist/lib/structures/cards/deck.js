import { Card } from "#structs/cards/card";
import arrayShuffle from "array-shuffle";
export class Deck {
    constructor() {
        this.cards = this.initCards();
        this.hands = new Map();
    }
    initCards() {
        const cards = [];
        for (let i = 0; i < 4; i++)
            for (let j = 1; j < 14; j++)
                cards.push(new Card(i, j));
        return cards;
    }
    /**
     * Draw cards from the deck
     * @param count Number of cards to draw (default: 1)
     * @returns {Card[]} Array of drawn cards
     */
    draw(count = 1) {
        let drawn = [];
        for (let i = 0; i < count; i++) {
            const card = this.cards.shift();
            if (card) {
                drawn.push(card);
            }
        }
        return drawn;
    }
    /**
     * Deal cards out from the deck
     * @param {number} nHands Number of hands to deal
     * @param {number} count Number of cards per hand - If 0 will deal until deck is empty
     * @returns {Card[][]} Array of array of dealt cards.
     */
    deal(count = 0) {
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                this.hands.forEach(h => h.draw());
            }
        }
        else if (count == 0) {
            while (this.cards.length > 0) {
                this.hands.forEach(h => h.draw());
            }
        }
    }
    /**
     * Shuffled the cards
     */
    shuffle() {
        this.cards = arrayShuffle(this.cards);
    }
    get size() {
        return this.cards.length;
    }
}
//# sourceMappingURL=deck.js.map