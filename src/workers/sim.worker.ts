import Card from "../models/Card";
import { CardName } from "../models/enums";
import Sim from "../models/Sim";

// @ts-ignore
const self = globalThis as unknown as DedicatedWorkerGlobalScope;

self.onmessage = (e: MessageEvent<CardName[]>) => {
    console.log('Worker received:', e.data)
    console.time('worker')
    const cardNames = e.data
    const deck = cardNames.map(c => Card.createFromName(c))
    //Let's hardcode iterations to 1,000 for now
    let result = Sim.run(deck, 1)
    self.postMessage(result);

    console.timeEnd('worker')
    console.log('Worker response sent')
};