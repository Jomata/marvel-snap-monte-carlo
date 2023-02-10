export default class Card {
    constructor(
        public readonly name: string,
        public readonly energy: number,
        public readonly power: number
    ) {
        
    }

    public toString() {
        return `${this.name} (${this.energy}/${this.power})`
    }
}