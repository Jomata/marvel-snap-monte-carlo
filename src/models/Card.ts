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

    readonly name : string
    readonly energy: number = 0
    readonly power: number = 0
    readonly revealed: boolean = false

    //Probably need to move this to a better interface containing onReveal, ongoing, onDestroy, etc.
    onReveal?:(game:Game) => Game;

    constructor(name:string, props?:Partial<CardProps>, effects?:Partial<CardEffects>) {
        this.name = name;
        Object.assign(this, props);
        Object.assign(this, effects);
    }

    //For now I'm putting the factory method in here, need to move it to a better place
    static createFromName(name:string) : Card {
        switch (name) {
            case "Psylocke":
                return new Card(name, {energy:2, power: 1}, {onReveal:(g => {
                    return g.addHook({name:"Psylocke onReveal", oneTimeOnly:true, onTurnStart:(g => g.copy({tempEnergy: g.tempEnergy+1}))})
                })} )
            default:
                return new Card(name)
        }
    }

    copy(props?:Partial<CardProps>) : Card {
        return new Card(this.name, props)
    }

    isPlayable(game:Game) : boolean {
        return game.getAvailableEnergy() >= this.energy
    }

    //Maybe this should also be in Game
    revealCard(game:Game) : Game {
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