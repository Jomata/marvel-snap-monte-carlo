import Card from "./Card";
import { CardName } from "../data/cards";
import Game from "./Game";

export interface SimResult {
    iterations : number
    successes : number
    failures : number
    sampleGame: {
        hand:CardName[],
        field:CardName[],
        library:CardName[],
    }
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
    static run(deck:Card[], iterations:number, logic:CardPriority, expected:CardName[], onProgress?:(progress:number)=>void) : SimResult {

        console.log("Run")

        let result : SimResult = {
            iterations : 0,
            successes : 0,
            failures : 0,
            sampleGame : {
                hand:[],
                field:[],
                library:[],
            },
        }

        for(let i =0; i<iterations; i++) {
            result.iterations++
            if(iterations % 10 === 0 && onProgress)
                onProgress(result.iterations / iterations)
            const game = new Game(deck)
            const endState = game
                .startGame()
                .playTurn(logic.turn1)
                .playTurn(logic.turn2)
                .playTurn(logic.turn3)
                .playTurn(logic.turn4)
                .playTurn(logic.turn5)
                .playTurn(logic.turn6)
                //.playTurn(logic.turn7) //TODO: Think what to do about LIMBO/MAGICK

            //Check that all of the expected cards are in the field
            const success = expected.every(e => endState.field.some(c => c.name === e))
            // if(endState.field.some(c => c.name === "Mister Negative")) 
            if(success)
                result.successes++;
            else
                result.failures++;

            //we save the last run
            result.sampleGame = {
                hand : endState.hand.map(c => c.name),
                field : endState.field.map(c => c.name),
                library : endState.library.map(c => c.name),
            }
        }

        return result
    }
}