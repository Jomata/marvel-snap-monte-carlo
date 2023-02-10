# Monte Carlo sim for Marvel Snap
* Starting with calculating the odds for Mr. Negative on T3
* Aiming to be expandable for other decks
* Aiming to be upgradeable into a genetic algorithm optimizer

## Basic objectives
- [ ] Properly simulate the 4 core cards (Zabu, Psylocke, Mr. N, Jubilee)
- [ ] Run X iterations
- [ ] Tally how many times you got t3 negative
- [ ] Run the iterations in a worker thread

## Extended goals
- [ ] "Code" the cards with a pseudo-language (Yaml?)
- [ ] Base values would be energy and power
- [ ] Make some generic reusable functions that can be expressed in the pseudo-language
- [ ] Implement custom functions for special cases
- [ ] Implement a pipeline to easily import new cards (and at least energy and power)

## Even more extended goals: Genetic Algorithm
- [ ] Implement a way to convert card lists to genomes
- [ ] Need to decide on a metric for genetic algorithm success

# Generic definition idea:
`````
- Lady Siff
  - energy: 3
  - power: 4
  - reveal:
    - discard: highest  //discard could have 2 parameters, one for count (int), and one for type (highest|lowest|any)
- Colleen Wing
  - energy: 2
  - power: 4
  - reveal:
    - discard: lowest
- Blade
  - energy: 1
  - power: 3
  - reveal:
    - discard: 1
- Psylocke
  - energy: 2
  - power: 1
  - reveal:
    - addEnergy: 1
- Zabu
  - energy: 2
  - power: 3
  - ongoing:
    - reduceCost
	  - energy: 4
	  - reduceBy: 1
	  - minimum: 1
	  
- Sera
  - energy: 5
  - power: 4
  - ongoing:
    - reduceCost
	  - energy: any
	  - reduceBy: 1
	  - minimum: 1
`````

Example of custom:
`````
- Mister Negative
  - energy: 4
  - power: -1
  - reveal:
    - revealMisterNegative
`````