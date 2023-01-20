import { Card } from "#structs/cards/card";
import type { Hand } from "#structs/cards/hand";
export declare class Deck {
    constructor();
    private initCards;
    /**
     * Draw cards from the deck
     * @param count Number of cards to draw (default: 1)
     * @returns {Card[]} Array of drawn cards
     */
    draw(count?: number): Card[];
    /**
     * Deal cards out from the deck
     * @param {number} nHands Number of hands to deal
     * @param {number} count Number of cards per hand - If 0 will deal until deck is empty
     * @returns {Card[][]} Array of array of dealt cards.
     */
    deal(count?: number): void;
    /**
     * Shuffled the cards
     */
    shuffle(): void;
    get size(): number;
}
export interface Deck {
    cards: Card[];
    hands: Map<string | number, Hand>;
}
//# sourceMappingURL=deck.d.ts.map