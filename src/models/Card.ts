import randomElement from "../helpers/randomElement";
import { DEBUG } from "./constants";
import { CardName, cardsData } from "../data/cards";
import Game from "./Game";

export type CardProps = {
    energy: number,
    power: number,
    revealed: boolean,
}

export type CardEffects = {
    onReveal:(game:Game) => Game
}

export default class Card {

    readonly name : CardName
    readonly energy: number = 0
    readonly power: number = 0
    readonly revealed: boolean = false

    //Probably need to move this to a better interface containing onReveal, ongoing, onDestroy, etc.
    onReveal?:(game:Game) => Game;

    constructor(name:CardName, props?:Partial<CardProps>, effects?:Partial<CardEffects>) {
        this.name = name;
        Object.assign(this, props);
        Object.assign(this, effects);
    }

    //For now I'm putting the factory method in here, need to move it to a better place
    static createFromName(name:CardName) : Card {
        const cardData = cardsData.find(r => r[0] === name)
        if(!cardData) return new Card(name)
        
        const baseCard = new Card(name, {energy:cardData[1], power:cardData[2]})

        switch (name) {
            case "Bast":
                return baseCard.copy({}, {onReveal:(g => {
                    const newHand = g.hand.map(c => c.copy({power:3}))
                    return g.copy({hand:newHand})
                })} )
            case "Electro":
                return baseCard.copy({}, {onReveal:(g => {
                    return g.addHook({name:"Electro onReveal", oneTimeOnly:true, onTurnStart:(g => g.copy({baseEnergy: g.baseEnergy+1}))})
                })} )
            case "Psylocke":
                return baseCard.copy({}, {onReveal:(g => {
                    return g.addHook({name:"Psylocke onReveal", oneTimeOnly:true, onTurnStart:(g => g.copy({tempEnergy: g.tempEnergy+1}))})
                })} )
            case "Zabu":
                return baseCard.copy({}); //TODO: Add Zabu ONGOING effect
            case "Jubilee":
                return baseCard.copy({}, {onReveal:(g => {
                    const pull = randomElement(g.library)
                    console.log(` > %c${name} %cpulls %c${pull.name}`, DEBUG.CSS_CARD_NAME, '', DEBUG.CSS_CARD_NAME)
                    return g.copy({
                        library: g.library.filter(c => c !== pull),
                        field: g.field.concat(pull),
                    })
                })})
            case "Mister Negative":
                return baseCard.copy({}, {onReveal:(g => {
                    const newLibrary = g.library.map(c => c.copy({power:c.energy, energy: Math.max(0, c.power)}))
                    return g.copy({library:newLibrary})
                })} )
            default:
                return baseCard;
        }
    }

    copy(props?:Partial<CardProps>, effects?:Partial<CardEffects>) : Card {
        return new Card(this.name, { ...this, ...props}, effects)
    }

    getEffectiveCost(game:Game) : number {
        //Harcoding Zabu and Sera here for now
        let cost = this.energy;
        if(game.field.some(c => c.name === "Sera")) cost = Math.max(1, cost - 1) //-1 cost, minimum 1
        //TODO: Store original cost somewhere for Zabu checking
        if(game.field.some(c => c.name === "Zabu") && this.energy === 4) cost = cost -1 //-1 cost, no minimum
        //TODO: Find a more elegant way to handle Wave
        if(game.field.some(c => c.name === "Wave")) {
            const thisTurn = game.turn
            const wavePlayedLastTurn = game.history.some(g => g.turn === thisTurn - 1 && g.field.some(c => c.name === "Wave" && c.revealed === false))
            if(wavePlayedLastTurn) return 4
        }
        
        return cost
    }

    isPlayable(game:Game) : boolean {
        return game.getAvailableEnergy() >= this.getEffectiveCost(game)
    }

    //Maybe this should also be in Game
    revealCard(game:Game) : Game {
        console.log(` > Revealing %c${this.name}`, DEBUG.CSS_CARD_NAME)
        const revealedCard = this.copy({revealed:true})
        const newBoard = game.copy({
            field: game.field.filter(c => c !== this).concat(revealedCard)
        })
        if(this.onReveal) return this.onReveal(newBoard)
        else return newBoard
    }

    public toString() {
        return `${this.name} (${this.energy}/${this.power})`
    }
}