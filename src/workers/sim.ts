import { CardName } from "../models/enums"
import { CardPriority, SimResult } from "../models/Sim"

const worker = new Worker(new URL('sim.worker', import.meta.url))

export interface SimWorkerPayload {
    cards: CardName[]
    runs: number
    logic: CardPriority
}

export default function SimWorker(payload: SimWorkerPayload) {
    worker.postMessage(payload)
    return new Promise<SimResult>((resolve, reject) => {
        worker.onmessage = (e: MessageEvent<SimResult>) => {
            resolve(e.data)
        }
        worker.onerror = (e: ErrorEvent) => {
            reject(e.error)
        }
        worker.onmessageerror = (e: MessageEvent<string>) => {
            reject(e.data)
        }
    })
}