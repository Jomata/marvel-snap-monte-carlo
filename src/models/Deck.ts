import { CardName } from "../data/cards"

export type Deck = {
    id: string,
    name: string,
    cards: CardName[],
}