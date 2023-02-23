import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useAsyncCallback } from 'react-async-hook';
import SimWorker from './workers/sim';
import { CardName } from './data/cards';
import { CardPriority } from './models/Sim';
import { Button, Container, Divider, Grid, Group, MantineProvider, MultiSelect, NumberInput, Space, Text } from '@mantine/core';
import DeckInput from './components/DeckInput';
import LogicInput from './components/LogicInput';

function App() {

  const asyncSim = useAsyncCallback(SimWorker)
  const [runsCount, setRunsCount] = useState(1000)
  const [expected, setExpected] = useState("Bast, Mister Negative")
  const [logic, setLogic] = useState<CardPriority>({
    turn1: ["Bast"],
    turn2: ["Zabu", "Psylocke"],
    turn3: ["Mister Negative", "Jubilee"],
    turn4: [],
    turn5: [],
    turn6: [],
    turn7: [],
  })
  const expectedCards = expected.split(',').map(c => c.trim() as CardName)
  //console.log(deckInput)
  //console.log(asyncSim.result)
  const [deck, setDeck] = useState<CardName[]>([
    "Bast",
    "Psylocke",
    "Zabu",
    "Ironheart",
    "Mystique",
    "Wolfsbane",
    "Brood",
    "Silver Surfer",
    "Mister Negative",
    "Jubilee",
    "Wong",
    "Iron Man",
  ])

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
      <Space h="xl" />
      <Container>
        <Grid>
          <Grid.Col span={3}><DeckInput deck={deck} onDeckChange={setDeck} /></Grid.Col>
          <Grid.Col span={9}><LogicInput deck={deck} onChange={setLogic} logic={logic} /></Grid.Col>

          <Grid.Col span={12}>
            We want the following cards on board:
            <MultiSelect data={deck} searchable />
          </Grid.Col>

          <Grid.Col span={12}>
            <Group>
              <>Run</>
              <NumberInput min={1} max={10000} step={1} value={runsCount} onChange={v => setRunsCount(v ?? runsCount)} /> 
              <>simulations</>
              <Button 
                disabled={asyncSim.loading || deck.length !== 12}
                onClick={e => asyncSim.execute({cards:deck, runs:runsCount, logic:logic, expected:expectedCards})}
              >
                Run
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        <Divider my="xl" />

        <Grid>
          <Grid.Col span={2}>
            Success rate: {asyncSim.result && <>{100 * asyncSim.result.successes / asyncSim.result.iterations}%</>}
            <br/>
            Sample board sate:
          </Grid.Col>
          {asyncSim.result && <>
            <Grid.Col span={"auto"}>
            Hand: <ul>{asyncSim.result.sampleGame.hand.map(c => <li key={c}>{c}</li>)}</ul>
            </Grid.Col>
            <Grid.Col span={"auto"}>
            Board: <ul>{asyncSim.result.sampleGame.field.map(c => <li key={c}>{c}</li>)}</ul>
            </Grid.Col>
            <Grid.Col span={"auto"}>
            Library: <ul>{asyncSim.result.sampleGame.library.map(c => <li key={c}>{c}</li>)}</ul>
            </Grid.Col>
          </>}
        </Grid>

      </Container>
    </MantineProvider>
    // <div className="App">
    //   <header className="App-header">
    //     <h2>Deck (1 card per line)</h2>
    //     <textarea onChange={e => setDeckInput(e.currentTarget.value)} style={{width: "200px",}} rows={12} value={deckInput} />
    //     <h3>Number of runs</h3>
    //     <input type="number" value={runsCount} max={1000} min={1} onChange={e => setRunsCount(e.currentTarget.valueAsNumber)} />
    //     <h3>Plays per turn, comma separated, in order of priority</h3>
    //     <table>
    //     <tbody>
    //       <tr>
    //         <td>Turn 1</td>
    //         <td><input type="text" value={logic.turn1.join(', ')} onChange={e => setCardPriority("turn1", e.currentTarget.value)} /></td>
    //       </tr>
    //       <tr>
    //         <td>Turn 2</td>
    //         <td><input type="text" value={logic.turn2.join(', ')} onChange={e => setCardPriority("turn2", e.currentTarget.value)} /></td>
    //       </tr>
    //       <tr>
    //         <td>Turn 3</td>
    //         <td><input type="text" value={logic.turn3.join(', ')} onChange={e => setCardPriority("turn3", e.currentTarget.value)} /></td>
    //       </tr>
    //       <tr>
    //         <td>Turn 4</td>
    //         <td><input type="text" value={logic.turn4.join(', ')} onChange={e => setCardPriority("turn4", e.currentTarget.value)} /></td>
    //       </tr>
    //       <tr>
    //         <td>Turn 5</td>
    //         <td><input type="text" value={logic.turn5.join(', ')} onChange={e => setCardPriority("turn5", e.currentTarget.value)} /></td>
    //       </tr>
    //       <tr>
    //         <td>Turn 6</td>
    //         <td><input type="text" value={logic.turn6.join(', ')} onChange={e => setCardPriority("turn6", e.currentTarget.value)} /></td>
    //       </tr>
    //       <tr>
    //         <td>Turn 7</td>
    //         <td><input type="text" value={logic.turn7.join(', ')} onChange={e => setCardPriority("turn7", e.currentTarget.value)} /></td>
    //       </tr>
    //     </tbody>
    //     </table>
    //     <h3>Cards desired to be on board</h3>
    //     <input type="text" value={expected} onChange={e => setExpected(e.target.value)} />
    //     <hr/>
    //     <button disabled={asyncSim.loading || deck.length !== 12} onClick={e => asyncSim.execute({cards:deck, runs:runsCount, logic:logic, expected:expectedCards})}>Do magic</button>
    //     Result:
    //     {asyncSim.result && <pre>{100 * asyncSim.result.successes / asyncSim.result.iterations}%</pre>}
    //   </header>
    // </div>
  );
}

export default App;
