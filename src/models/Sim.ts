import randomElement from "../helpers/randomElement";
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
            let turn0 = game.start()
            let turn1 = turn0.nextTurn()
            //First, we need Psylocke or Zabu in Hand on T2
            let turn2 = turn1.nextTurn()
            let rampCount = turn2.hand.filter(card => card.name === "Zabu" || card.name === "Psylocke").length
            if(rampCount < 1) {
                result.failures++;
                continue;
            }

            //If we have Psylocke, we play her
            let psylocke = turn2.hand.find(c => c.name === "Psylocke")
            let turn2B = psylocke ? turn2.playCard(psylocke) : turn2
            //turn2B.debug()

            let turn3 = turn2B.nextTurn()

            // console.log(turn3)
            //turn3.debug()
            // console.table({
            //     turn: turn3.turn,
            //     energy: turn3.getAvailableEnergy(),
            //     hand: turn3.hand.map(c => c.name),
            //     field: turn3.field.map(c => c.name),
            //     library: turn3.library.map(c => c.name),
            // })

            let negativeOnHand = turn3.hand.some(card => card.name === "Mister Negative")
            if(negativeOnHand) {
                result.successes++;
                continue;
            }

            let jubileeOnHand = turn3.hand.some(card => card.name === "Jubilee")
            if(jubileeOnHand) {
                //She has a 1 in [library size] chance of pulling Mr N
                let pull = randomElement(turn3.library)
                if(pull.name === "Mister Negative") {
                    result.successes++;
                    continue;
                }
            }

            result.failures++;
        }

        return result
    }
}