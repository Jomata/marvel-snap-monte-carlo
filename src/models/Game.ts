//An instance of a single Marvel Snap game.
//Ignoring locations and oppo deck
import check from "../helpers/check";
import { shuffle } from "../helpers/shuffle";
import Card from "./Card";

export type GameProps = {
    //deck:Card[]
    turn:number
    hand:Card[]
    library:Card[]
    field:Card[]
    baseEnergy:number
    tempEnergy:number
    usedEnergy:number
}

export type GameHook = {
    name?:string
    oneTimeOnly:boolean
    onTurnStart? :(game:Game) => Game
}

export default class Game {
    public readonly deck:Card[]
    public readonly turn:number = 0;

    public readonly baseEnergy:number = 0;
    public readonly tempEnergy:number = 0;
    public readonly usedEnergy:number = 0;

    public readonly hand:Card[] = [];
    public readonly library:Card[] = [];
    public readonly field:Card[] = [];

    readonly hooks:GameHook[] = []

    // constructor(deck:Card[], {turn, hand, library, baseEnergy, tempEnergy, usedEnergy}:Partial<GameProps>) {
    //     this.deck = deck
    //     this.turn = turn ?? this.turn
    //     this.hand = hand ?? this.hand
    //     this.library = library ?? this.library
    //     this.baseEnergy = baseEnergy ?? this.baseEnergy
    //     this.tempEnergy = tempEnergy ?? this.tempEnergy
    //     this.usedEnergy = usedEnergy ?? this.usedEnergy
    //     this.validateState()
    // }

    constructor(deck:Card[], props?:Partial<GameProps>, hooks:GameHook[] = []) {
        this.deck = deck
        Object.assign(this, props)
        this.hooks = hooks;
        this.validateState()
    }

    private validateState() {
        check(this.deck.length === 12, `deck.length is ${this.deck.length}`)
        check(this.hand.length <= 7, `hand.length is ${this.hand.length}`)
        check(this.turn >= 0 && this.turn <= 7, `turn is ${this.turn}`)
    }

    //Props overwrites whatever is set, hooks overwrites the whole array if set
    copy(props?:Partial<GameProps>, hooks?:GameHook[]) : Game {
        return new Game(this.deck, {...this, ...props}, hooks ?? this.hooks)
    }

    addHook(newHook:GameHook) : Game {
        return this.copy({}, [...this.hooks, newHook])
    }

    debug() {
        console.table({
            turn: this.turn,
            energy: this.getAvailableEnergy(),
            hand: this.hand.map(c => c.name),
            field: this.field.map(c => c.name),
            library: this.library.map(c => c.name),
        })
    }

    start() : Game {
        const shuffledDeck = shuffle([...this.deck])
        const openingHand = shuffledDeck.slice(0, 3)
        const library = shuffledDeck.slice(3)

        return this.copy({
            turn: 0,
            baseEnergy: 0,
            tempEnergy: 0,
            hand: openingHand,
            library: library,
        }) 
    }

    //Runs all of the onTurnStart hooks, deletes the disposable ones, and returns the new game state
    private onTurnStart() : Game {
        return this.hooks.reduce((acc, hook) => {
            if(hook.onTurnStart) {
                console.log('Running onTurnStart hook', hook.name)
                const afterHook = hook.onTurnStart(acc)
                if(hook.oneTimeOnly) {
                    return acc.copy({}, acc.hooks.filter(h => h !== hook))
                } else {
                    return afterHook
                }
            } else {
                return acc
            }
        }, this as Game);
    }

    nextTurn() : Game {
        console.log(`Turn ${this.turn+1} starts`)
        if(this.turn === 0) {
            console.log(`Opening hand`, this.hand.map(c => c.name))
        }
        const draw = this.library.slice(0, 1)[0]
        console.log(`Drew`, draw.name)
        const remaining = this.library.slice(1)

        return this.copy({
            turn: this.turn + 1,
            baseEnergy: this.baseEnergy + 1,
            tempEnergy: 0, //temp energy gets reset every turn
            hand: [...this.hand, draw],
            library: remaining,
        }).onTurnStart() 
    }

    playCard(card:Card) : Game {
        console.log("Playing", card.name)
        //We remove the card from hand
        //Add it to the field
        //Add the energy cost to used energy
        //And return the new state
        return this.copy({
            hand : this.hand.filter(c => c !== card),
            field: [...this.field, card],
            usedEnergy: this.usedEnergy + card.energy,
        })
    }

    getAvailableEnergy():number {
        return this.baseEnergy + this.tempEnergy
    }
}