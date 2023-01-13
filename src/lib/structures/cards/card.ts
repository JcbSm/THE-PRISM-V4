export enum Suit {
    Clubs = 0,
    Diamonds,
    Hearts,
    Spades,
}

export const SuitStrings = {
    0: 'Clubs',
    1: 'Diamonds',
    2: 'Hearts',
    3: 'Spades'
}

export enum Rank {
    Joker = 0,
    Ace,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King
}

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
}

export class Card {
    constructor(suit: Suit, rank: Rank) {
        this.suit = suit;
        this.rank = rank;
        this.faceup = false;
    }

    public flip(): void {
        this.faceup = !this.faceup;
    };

    get filename() {
        return `${RankStrings[this.rank].toLowerCase()}_of_${SuitStrings[this.suit].toLowerCase()}.png`
    }

    get name() {
        return  `${RankStrings[this.rank]} of ${SuitStrings[this.suit]}`
    }
}

export interface Card {
    suit: Suit;
    rank: Rank;
    faceup: boolean;
}