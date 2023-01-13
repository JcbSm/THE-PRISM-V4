export declare enum Suit {
    Clubs = 0,
    Diamonds = 1,
    Hearts = 2,
    Spades = 3
}
export declare const SuitStrings: {
    0: string;
    1: string;
    2: string;
    3: string;
};
export declare enum Rank {
    Joker = 0,
    Ace = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13
}
export declare const RankStrings: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    13: string;
};
export declare class Card {
    constructor(suit: Suit, rank: Rank);
    flip(): void;
    get filename(): string;
    get name(): string;
}
export interface Card {
    suit: Suit;
    rank: Rank;
    faceup: boolean;
}
//# sourceMappingURL=card.d.ts.map