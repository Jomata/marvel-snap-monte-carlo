//An instance of a single Marvel Snap game.
//Ignoring locations and oppo deck
import check from "../helpers/check";
import { shuffle } from "../helpers/shuffle";
import Card from "./Card";
import { CardName } from "./enums";
import { DEBUG } from './constants'

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

/**
 * Game flow
 * Game.startGame : Shuffles deck, resets field, draws opening hand of 3 cards
 * Game.startTurn: Starts the turn. Increases base energy by 1, cleans up temp energy, etc. 
 * Game.playCard (n) : Plays the card. Card is still not revealed. 
 * Game.endTurn : Ends the current turn. Reveals the cards played this turn, executing their onReveals if any
 * TODO: Keep track of turns started/ended, if mismatch throw error
 */
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

    startGame() : Game {
        const shuffledDeck = shuffle([...this.deck])
        const openingHand = shuffledDeck.slice(0, 3)
        const library = shuffledDeck.slice(3)
        console.log(`Opening hand`, openingHand.map(c => c.name))
        
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
                console.log(' > Running onTurnStart hook', hook.name)
                const afterHook = hook.onTurnStart(acc)
                if(hook.oneTimeOnly) {
                    return afterHook.copy({}, acc.hooks.filter(h => h !== hook))
                } else {
                    return afterHook
                }
            } else {
                return acc
            }
        }, this as Game);
    }

    startTurn() : Game {
        console.log(`Turn ${this.turn+1} start`)
        const draw = this.library.slice(0, 1)[0]
        console.log(` > Drew %c${draw.name}`, DEBUG.CSS_CARD_NAME)
        const remaining = this.library.slice(1)

        return this.copy({
            turn: this.turn + 1,
            baseEnergy: this.baseEnergy + 1,
             //energy gets reset every turn
            tempEnergy: 0,
            usedEnergy: 0,
            hand: [...this.hand, draw],
            library: remaining,
        }).onTurnStart() 
    }

    endTurn() : Game {
        //TODO: Proc onreveals 
        const unrevealedCards = this.field.filter(c => c.revealed === false)
        console.log(`Turn ${this.turn} end`)
        return unrevealedCards.reduce((acc, card) => {
            return card.revealCard(acc);
        }, this as Game)
    }

    //Plays the card, no questions asked
    playCard(card:Card) : Game {
        console.log(` > Playing %c${card.name} %cusing %c${card.getEffectiveCost(this)}/${this.getAvailableEnergy()} %cenergy`, DEBUG.CSS_CARD_NAME, '', DEBUG.CSS_ENERGY, '')
        //We remove the card from hand
        //Add it to the field
        //Add the energy cost to used energy
        //And return the new state
        return this.copy({
            hand : this.hand.filter(c => c !== card),
            field: [...this.field, card],
            usedEnergy: this.usedEnergy + card.getEffectiveCost(this),
        })
    }

    //Checks if we can play the card (have energy, have card in hand), then does so if possible
    //If it's not possible, this is a no-op
    playCardIfPossible(name:CardName) : Game {
        const cardInHand = this.hand.find(c => c.name === name)
        if(cardInHand === undefined) return this.copy()
        if(cardInHand.isPlayable(this)) return this.playCard(cardInHand);
        else return this.copy()
    }

    getAvailableEnergy():number {
        return this.baseEnergy + this.tempEnergy - this.usedEnergy
    }
}