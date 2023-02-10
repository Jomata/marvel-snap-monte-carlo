//An instance of a single Marvel Snap game.
//Ignoring locations and oppo deck
import { shuffle } from "../helpers/shuffle";
import Card from "./Card";

export interface GameProps {
    deck:Card[]
    turn?:number
    hand?:Card[]
    library?:Card[]
}

export default class Game {
    public readonly deck:Card[]
    public readonly turn:number = 0;
    public readonly hand:Card[] = [];
    public readonly library:Card[] = [];

    constructor({deck, turn, hand, library}:GameProps) {
        this.deck = deck
        this.turn = turn ?? this.turn
        this.hand = hand ?? this.hand
        this.library = library ?? this.library
    }

    start() : Game {
        const shuffledDeck = shuffle([...this.deck])
        const openingHand = shuffledDeck.slice(0, 3)
        const library = shuffledDeck.slice(3)
        return new Game({
            deck: this.deck,
            turn: 0,
            hand: openingHand,
            library: library,
        }) 
    }

    nextTurn() : Game {
        const draw = this.library.slice(0, 1)[0]
        const remaining = this.library.slice(1)

        return new Game({
            deck: this.deck,
            turn: this.turn + 1,
            hand: [...this.hand, draw],
            library: remaining,
        }) 
    }
}