import Card from "../models/Card";
import { CardName } from "../data/cards";
import Sim from "../models/Sim";
import { SimWorkerPayload } from "./sim";

// @ts-ignore
const self = globalThis as unknown as DedicatedWorkerGlobalScope;

self.onmessage = (e: MessageEvent<SimWorkerPayload>) => {
    console.log('Worker received:', e.data)
    console.time('worker')
    const cardNames = e.data.cards
    const deck = cardNames.map(c => Card.createFromName(c as CardName))
    let result = Sim.run(deck, e.data.runs, e.data.logic, e.data.expected, (progress) => {
        self.postMessage({type:'progress',progress})
    })
    self.postMessage({type:"result", result});

    console.timeEnd('worker')
    console.log('Worker response sent')
};