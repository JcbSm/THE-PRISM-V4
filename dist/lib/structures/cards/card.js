export var Suit;
(function (Suit) {
    Suit[Suit["Clubs"] = 0] = "Clubs";
    Suit[Suit["Diamonds"] = 1] = "Diamonds";
    Suit[Suit["Hearts"] = 2] = "Hearts";
    Suit[Suit["Spades"] = 3] = "Spades";
})(Suit || (Suit = {}));
export const SuitStrings = {
    0: 'Clubs',
    1: 'Diamonds',
    2: 'Hearts',
    3: 'Spades'
};
export var Rank;
(function (Rank) {
    Rank[Rank["Joker"] = 0] = "Joker";
    Rank[Rank["Ace"] = 1] = "Ace";
    Rank[Rank["Two"] = 2] = "Two";
    Rank[Rank["Three"] = 3] = "Three";
    Rank[Rank["Four"] = 4] = "Four";
    Rank[Rank["Five"] = 5] = "Five";
    Rank[Rank["Six"] = 6] = "Six";
    Rank[Rank["Seven"] = 7] = "Seven";
    Rank[Rank["Eight"] = 8] = "Eight";
    Rank[Rank["Nine"] = 9] = "Nine";
    Rank[Rank["Ten"] = 10] = "Ten";
    Rank[Rank["Jack"] = 11] = "Jack";
    Rank[Rank["Queen"] = 12] = "Queen";
    Rank[Rank["King"] = 13] = "King";
})(Rank || (Rank = {}));
export const RankStrings = {
    0: 'Joker',
    1: 'Ace',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: 'Jack',
    12: 'Queen',
    13: 'King'
};
export class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.faceup = false;
    }
    flip() {
        this.faceup = !this.faceup;
    }
    ;
    get filename() {
        return `${RankStrings[this.rank].toLowerCase()}_of_${SuitStrings[this.suit].toLowerCase()}.png`;
    }
    get name() {
        return `${RankStrings[this.rank]} of ${SuitStrings[this.suit]}`;
    }
}
//# sourceMappingURL=card.js.map