import Card from "../models/Card";
import Sim from "../models/Sim";

// @ts-ignore
const self = globalThis as unknown as DedicatedWorkerGlobalScope;

self.onmessage = (e: MessageEvent<Card[]>) => {
    console.log('Worker received:', e.data)
    console.time('worker')
    
    //Let's hardcode iterations to 1,000 for now
    let result = Sim.run(e.data, 10)
    self.postMessage(result);

    console.timeEnd('worker')
    console.log('Worker response sent')
};