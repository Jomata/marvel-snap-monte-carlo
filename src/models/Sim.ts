import Card from "./Card";
import { CardName } from "./enums";
import Game from "./Game";

export interface SimResult {
    iterations : number
    successes : number
    failures : number
}

export interface CardPriority {
    turn1 : CardName[],
    turn2 : CardName[],
    turn3 : CardName[],
    turn4 : CardName[],
    turn5 : CardName[],
    turn6 : CardName[],
    turn7 : CardName[],
}

export default abstract class Sim {
    static run(deck:Card[], iterations:number) : SimResult {

        console.log("Run")

        let result = {
            iterations : 0,
            successes : 0,
            failures : 0,
        }

        for(let i =0; i<iterations; i++) {
            result.iterations++
            let game = new Game(deck)
            let endState = game
                .startGame()
                //Turn 1
                .startTurn()
                .playCardIfPossible("Bast")
                .endTurn()
                //Turn 2
                .startTurn()
                .playCardIfPossible("Zabu")
                .playCardIfPossible("Psylocke")
                .endTurn()
                //Turn 3
                .startTurn()
                .playCardIfPossible("Mister Negative")
                .playCardIfPossible("Jubilee")
                .endTurn()

            // endState.debug()
            
            if(endState.field.some(c => c.name === "Mister Negative")) 
                result.successes++;
            else
                result.failures++;
        }

        return result
    }
}