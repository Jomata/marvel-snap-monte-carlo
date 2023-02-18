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
    static run(deck:Card[], iterations:number, logic:CardPriority) : SimResult {

        console.log("Run")

        let result = {
            iterations : 0,
            successes : 0,
            failures : 0,
        }

        for(let i =0; i<iterations; i++) {
            result.iterations++
            const game = new Game(deck)
            const endState = game
                .startGame()
                .playTurn(logic.turn1)
                .playTurn(logic.turn2)
                .playTurn(logic.turn3)
                .playTurn(logic.turn4)
                .playTurn(logic.turn5)
                .playTurn(logic.turn6)
                //.playTurn(logic.turn7) //TODO: Think what to do about LIMBO
            
            if(endState.field.some(c => c.name === "Mister Negative")) 
                result.successes++;
            else
                result.failures++;
        }

        return result
    }
}