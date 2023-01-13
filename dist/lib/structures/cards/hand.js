export class Hand {
    constructor(id, deck) {
        this.id = id;
        this.deck = deck;
        deck.hands.set(id, this);
        this.cards = [];
    }
    draw(count = 1) {
        const cards = this.deck.draw(count);
        this.cards.push(...cards);
    }
}
//# sourceMappingURL=hand.js.map