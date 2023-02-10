//https://stackoverflow.com/questions/5915096/get-a-random-item-from-a-javascript-array
export default function randomElement<T>(items:T[]):T {
    return items[items.length * Math.random() | 0]
}