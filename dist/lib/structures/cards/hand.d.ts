import type { Deck } from "#structs/cards/deck";
import type { Card } from "#structs/cards/card";
export declare class Hand {
    constructor(id: string | number, deck: Deck);
    draw(count?: number): void;
}
export interface Hand {
    id: string | number;
    deck: Deck;
    cards: Card[];
}
//# sourceMappingURL=hand.d.ts.map