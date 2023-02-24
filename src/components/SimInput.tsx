import { Container, Grid, TextInput, MultiSelect, Group, Button, NumberInput, Divider, Center } from "@mantine/core";
import { useState } from "react";
import { useAsyncCallback } from "react-async-hook";
import { CardName } from "../data/cards";
import { CardPriority } from "../models/Sim";
import SimWorker  from "../workers/sim";
import DeckInput from "./DeckInput";
import LogicInput from "./LogicInput";

export type SimInputProps = {
    selectedDeck:string,
    onNameChange:(deckName:string)=>void,
    onDeckChange:(cards:CardName[])=>void,
}

export default function SimInput({
    selectedDeck,
    onNameChange,
    onDeckChange,
}:SimInputProps) {
    const asyncSim = useAsyncCallback(SimWorker)
    const [simProgress, setSimProgress] = useState(0)
    const [deckName, setDeckName] = useState(selectedDeck)
    const [runsCount, setRunsCount] = useState(1000)
    const [expected, setExpected] = useState<CardName[]>(["Bast", "Mister Negative"])
    const [logic, setLogic] = useState<CardPriority>({
        turn1: ["Bast"],
        turn2: ["Zabu", "Psylocke"],
        turn3: ["Mister Negative", "Jubilee"],
        turn4: [],
        turn5: [],
        turn6: [],
        turn7: [],
    })
    
    const [deck, setDeck] = useState<CardName[]>(() => {
        //Load deck from memory here
        const deckValue:CardName[] = [
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
        ]
        onDeckChange(deckValue);
        return deckValue
    })

    return (<Container>
        <Grid>
          <Grid.Col span={12}>
              <TextInput label="Deck name" value={deckName} onChange={e => {setDeckName(e.currentTarget.value); onNameChange(e.currentTarget.value)}} />
          </Grid.Col>
          <Grid.Col span={3}><DeckInput deck={deck} onDeckChange={v => {setDeck(v); onDeckChange(v);}} /></Grid.Col>
          <Grid.Col span={9}><LogicInput deck={deck} onChange={setLogic} logic={logic} /></Grid.Col>

          <Grid.Col span={12}>
            We want the following cards on board:
            <MultiSelect data={deck} searchable value={expected} onChange={v => setExpected(v.map(v => v as CardName))} />
          </Grid.Col>

          <Grid.Col span={12}>
            <Group>
              <Button 
                  disabled={deck.length !== 12}
                //   variant="outline"
                //   onClick={e => asyncSim.execute({cards:deck, runs:runsCount, logic:logic, expected})}
                  onClick={e => asyncSim.execute({cards:deck, runs:runsCount, logic:logic, expected}, setSimProgress)}
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