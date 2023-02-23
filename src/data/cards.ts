//name, cost, power
export const cardsData:[CardName,number,number][] = [
  ["Bast",1,1],
  ["Mister Negative",4,-1],
  ["Psylocke",2,1],
  ["Zabu",2,2],
  ["Jubilee",4,1],
  ["Abomination",5,8],
  ["Absorbing Man",4,3],
  ["Adam Warlock",2,0],
  ["Aero",5,7],
  ["Agent 13",1,2],
  ["Agent Coulson",3,4],
  ["America Chavez",6,9],
  ["Ironheart",3,0],
  ["Mystique",3,0],
  ["Wolfsbane",3,1],
  ["Brood",3,2],
  ["Silver Surfer",3,2],
  ["Wong",4,2],
  ["Iron Man",5,0],
  ["Sera",5,4],
]

//TODO: Figure out how to get this list from cardsData
export const CARD_NAMES = [
"Bast",
"Mister Negative",
"Psylocke",
"Zabu",
"Jubilee",
"Abomination",
"Absorbing Man",
"Adam Warlock",
"Aero",
"Agent 13",
"Agent Coulson",
"America Chavez",
"Ironheart",
"Mystique",
"Wolfsbane",
"Brood",
"Silver Surfer",
"Wong",
"Iron Man",
"Sera",
] as const

export type CardName = typeof CARD_NAMES[number]