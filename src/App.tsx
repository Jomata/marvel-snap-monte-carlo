import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useAsyncCallback } from 'react-async-hook';
import SimWorker from './workers/sim';
import Card from './models/Card';

function App() {

  const asyncSim = useAsyncCallback(SimWorker)
  const deck = ["Psylocke", "Zabu", "Mister Negative", "Jubilee", "5", "6", "7", "8", "9", "10", "11", "12"].map(name => new Card(name, 0, 0))
  console.log(asyncSim.result)

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
