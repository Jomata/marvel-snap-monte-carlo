import { Container, Grid, TextInput, MultiSelect, Group, Button, NumberInput, Divider, Center } from "@mantine/core";
import { useLocalStorage } from '@mantine/hooks';
import { useState } from "react";
import { useAsyncCallback } from "react-async-hook";
import { CardName } from "../data/cards";
import { Deck } from "../models/Deck";
import { CardPriority } from "../models/Sim";
import SimWorker  from "../workers/sim";
import DeckInput from "./DeckInput";
import LogicInput from "./LogicInput";

export type SimInputProps = {
    deck:Deck,
    onNameChange:(deckName:string)=>void,
    onDeckChange:(cards:CardName[])=>void,
}

function getDefaultLogic(deckId:string):CardPriority {
  switch (deckId) {
    case `sample_negative`:
      return {
          turn1: ["Bast"],
          turn2: ["Zabu", "Psylocke"],
          turn3: ["Mister Negative", "Jubilee"],
          turn4: [],
          turn5: [],
          turn6: [],
          turn7: [],
      }
      case `sample_galactus`:
        return {
          turn1: [],
          turn2: [],
          turn3: ["Wave", "Electro"],
          turn4: ["Galactus", "Electro", "Psylocke"],
          turn5: ["Galactus"],
          turn6: [],
          turn7: [],
      }
  
    default:
      return {
        turn1: [],
        turn2: [],
        turn3: [],
        turn4: [],
        turn5: [],
        turn6: [],
        turn7: [],
    }
  }
}

function getDefaultExpected(deckId:string):CardName[] {
  switch (deckId) {
    case `sample_negative`:
      return ["Mister Negative"]
      case `sample_galactus`:
        return ["Galactus"]  
    default:
      return []
  }
}

export default function SimInput({
    deck,
    onNameChange,
    onDeckChange,
}:SimInputProps) {
    const asyncSim = useAsyncCallback(SimWorker)
    const [simProgress, setSimProgress] = useState(0)
    const [runsCount, setRunsCount] = useState(1000)
    const [expected, setExpected] = useLocalStorage<CardName[]>({key:`casino_expected_${deck.id}`, defaultValue: getDefaultExpected(deck.id)})
    const [logic, setLogic] = useLocalStorage<CardPriority>({key:`casino_logic_${deck.id}`, defaultValue: getDefaultLogic(deck.id)})

    return (<Container>
        <Grid>
          <Grid.Col span={12}>
              <TextInput label="Deck name" value={deck.name} onChange={e => {onNameChange(e.currentTarget.value)}} />
          </Grid.Col>
          <Grid.Col span={3}><DeckInput deck={deck.cards} onDeckChange={onDeckChange} /></Grid.Col>
          <Grid.Col span={9}><LogicInput deck={deck.cards} onChange={setLogic} logic={logic} /></Grid.Col>

          <Grid.Col span={12}>
            We want the following cards on board:
            <MultiSelect data={deck.cards} searchable value={expected} onChange={v => setExpected(v.map(v => v as CardName))} />
          </Grid.Col>

          <Grid.Col span={12}>
            <Group>
              <Button 
                  disabled={deck.cards.length !== 12}
                  onClick={e => asyncSim.execute({cards:deck.cards, runs:runsCount, logic:logic, expected}, setSimProgress)}
                  loading={asyncSim.loading}
                  loaderPosition="center"
                  style={asyncSim.loading ? {
                    backgroundImage: `linear-gradient(to right, #06D6A0 ${simProgress * 100}%, transparent 0%)`,
                    backgroundSize: `100% 100%`,
                    border: "1px solid #06D6A0"
                  } : {}}
                >
                Run
              </Button>
              <NumberInput min={1} max={10000} step={1} value={runsCount} onChange={v => setRunsCount(v ?? runsCount)} /> 
              <>simulations</>
            </Group>
          </Grid.Col>
        </Grid>

        <Divider my="xl" />

        <Grid>
          <Grid.Col span={12}>
            Success rate: {asyncSim.result && <>{100 * asyncSim.result.successes / asyncSim.result.iterations}%</>}
          </Grid.Col>
          <Grid.Col span={3}>
            Sample board sate:
          </Grid.Col>
          {asyncSim.result && <>
            <Grid.Col span={"auto"}>
              <Center>Hand</Center>
              <ul>{asyncSim.result.sampleGame.hand.map(c => <li key={c}>{c}</li>)}</ul>
            </Grid.Col>
            <Grid.Col span={"auto"}>
              <Center>Board</Center>
              <ul>{asyncSim.result.sampleGame.field.map(c => <li key={c}>{c}</li>)}</ul>
            </Grid.Col>
            <Grid.Col span={"auto"}>
              <Center>Library</Center>
              <ul>{asyncSim.result.sampleGame.library.map(c => <li key={c}>{c}</li>)}</ul>
            </Grid.Col>
          </>}
        </Grid>
      </Container>)
}