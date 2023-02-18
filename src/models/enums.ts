const CARD_NAMES = [
    "Abomination",
    "Absorbing Man",
    "Adam Warlock",
    "Aero",
    "Agent 13",
    "Agent Coulson",
    "America Chavez",
    "Angel",
    "Bast",
    "Jubilee",
    "Mister Negative",
    "Psylocke",
    "Zabu",
] as const

export type CardName = typeof CARD_NAMES[number]