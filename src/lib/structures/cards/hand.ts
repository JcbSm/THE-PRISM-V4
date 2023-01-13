import type { Deck } from "#structs/cards/deck";
import type { Card } from "#structs/cards/card";

export class Hand {
    constructor(id: string | number, deck: Deck) {
        this.id = id
        this.deck = deck;
        deck.hands.set(id, this);
        this.cards = [];
    }

    public draw(count = 1) {
        const cards = this.deck.draw(count);
        this.cards.push(...cards)
    }
}

export interface Hand {
    id: string | number;
    deck: Deck;
    cards: Card[]
}