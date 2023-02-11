import Card from "./Card";
import Game from "./Game";

export interface SimResult {
    iterations : number
    successes : number
    failures : number
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
                .endTurn()
                //Turn 2
                .startTurn()
                .playCardIfPossible("Psylocke")
                .playCardIfPossible("Zabu")
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