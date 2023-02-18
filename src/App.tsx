import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useAsyncCallback } from 'react-async-hook';
import SimWorker from './workers/sim';
import { CardName } from './models/enums';

function App() {

  const [runsCount, setRunsCount] = useState(100)
  const [deckInput, setDeckInput] = useState(`
Bast
Mister Negative
Psylocke
Zabu
Jubilee
Abomination 
Absorbing Man 
Adam Warlock 
Aero 
Agent 13 
Agent Coulson 
America Chavez
  `.trim())

  const deck = deckInput.split('\n').map(l => l.trim() as CardName).filter(cn => cn !== null)
  //console.log(deckInput)
  const asyncSim = useAsyncCallback(SimWorker)

  //console.log(asyncSim.result)

  return (
    <div className="App">
      <header className="App-header">
        <h2>Deck (1 card per line)</h2>
        <textarea onChange={e => setDeckInput(e.currentTarget.value)} style={{width: "200px",}} rows={12} value={deckInput} />
        <h3>Number of runs</h3>
        <input type="number" value={runsCount} max={1000} min={1} onChange={e => setRunsCount(e.currentTarget.valueAsNumber)} />
        <h3>Plays per turn, comma separated, in order of priority</h3>
        <table>
        <tbody>
          <tr>
            <td>Turn 1</td>
            <td><input type="text" defaultValue={"Bast"} /></td>
          </tr>
          <tr>
            <td>Turn 2</td>
            <td><input type="text" defaultValue={"Zabu, Psylocke"} /></td>
          </tr>
          <tr>
            <td>Turn 3</td>
            <td><input type="text" defaultValue={"Mister Negative, Jubilee"} /></td>
          </tr>
          <tr>
            <td>Turn 4</td>
            <td><input type="text"/></td>
          </tr>
          <tr>
            <td>Turn 5</td>
            <td><input type="text"/></td>
          </tr>
          <tr>
            <td>Turn 6</td>
            <td><input type="text"/></td>
          </tr>
          <tr>
            <td>Turn 7</td>
            <td><input type="text"/></td>
          </tr>
        </tbody>
        </table>
        <hr/>
        <button disabled={asyncSim.loading || deck.length !== 12} onClick={e => asyncSim.execute({cards:deck, runs:runsCount})}>Do magic</button>
        Result:
        {asyncSim.result && <pre>{asyncSim.result.successes / asyncSim.result.iterations}</pre>}
      </header>
    </div>
  );
}

export default App;
