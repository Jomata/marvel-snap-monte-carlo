import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useAsyncCallback } from 'react-async-hook';
import SimWorker from './workers/sim';
import { CardName } from './models/enums';

const deck:CardName[] = [
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
  "Angel",
]

function App() {

  const asyncSim = useAsyncCallback(SimWorker)

  //console.log(asyncSim.result)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
        <button disabled={asyncSim.loading} onClick={e => asyncSim.execute(deck)}>Do magic</button>
        Result:
        {asyncSim.result && <pre>{asyncSim.result.successes / asyncSim.result.iterations}</pre>}
      </header>
    </div>
  );
}

export default App;
