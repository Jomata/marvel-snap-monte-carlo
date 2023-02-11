import randomElement from "../helpers/randomElement";
import { CardName } from "./enums";
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
        switch (name) {
            case "Psylocke":
                return new Card(name, {energy:2, power: 1}, {onReveal:(g => {
                    return g.addHook({name:"Psylocke onReveal", oneTimeOnly:true, onTurnStart:(g => g.copy({tempEnergy: g.tempEnergy+1}))})
                })} )
            case "Zabu":
                return new Card(name, {energy:2, power: 2})
            case "Jubilee":
                return new Card(name, {energy: 4, power: 1}, {onReveal:(g => {
                    const pull = randomElement(g.library)
                    return g.copy({
                        library: g.library.filter(c => c !== pull),
                        field: g.field.concat(pull),
                    })
                })})
            case "Mister Negative":
                return new Card(name, {energy:4, power:-1})
            default:
                return new Card(name)
        }
    }

    copy(props?:Partial<CardProps>) : Card {
        return new Card(this.name, props)
    }

    getEffectiveCost(game:Game) : number {
        //Harcoding Zabu here
        if(game.field.some(c => c.name === "Zabu") && this.energy === 4) return 3
        else return this.energy
    }

    isPlayable(game:Game) : boolean {
        return game.getAvailableEnergy() >= this.getEffectiveCost(game)
    }

    //Maybe this should also be in Game
    revealCard(game:Game) : Game {
        console.log(` > Revealing ${this.name}`)
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