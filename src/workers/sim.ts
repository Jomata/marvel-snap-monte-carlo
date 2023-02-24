import { CardName } from "../data/cards";
import { CardPriority, SimResult } from "../models/Sim"

const worker = new Worker(new URL('sim.worker', import.meta.url))

export interface SimWorkerPayload {
    cards: CardName[]
    runs: number
    logic: CardPriority
    expected: CardName[]
}

type SimWorkerMessage = {
    type: 'progress' | 'result'
    result?: SimResult
    progress?: number
}

export default function SimWorker(payload: SimWorkerPayload, onProgress?:(progress:number)=>void) {
    worker.postMessage(payload)
    return new Promise<SimResult>((resolve, reject) => {
        worker.onmessage = (e: MessageEvent<SimWorkerMessage>) => {
            if(e.data.type === 'result' && e.data.result !== undefined) {
                resolve(e.data.result)
            }
            if(e.data.type === 'progress' && e.data.progress !== undefined) {
                onProgress?.(e.data.progress)
            }
        }
        worker.onerror = (e: ErrorEvent) => {
            reject(e.error)
        }
        worker.onmessageerror = (e: MessageEvent<string>) => {
            reject(e.data)
        }
    })
}