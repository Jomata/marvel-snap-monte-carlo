import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useAsyncCallback } from 'react-async-hook';
import SimWorker from './workers/sim';
import { CardName } from './data/cards';
import { CardPriority } from './models/Sim';
import { AppShell, Avatar, Box, Button, Center, Container, Divider, Grid, Group, Header, MantineProvider, MultiSelect, Navbar, NavLink, NumberInput, Space, Text, TextInput, Title, UnstyledButton, useMantineTheme } from '@mantine/core';
import DeckInput from './components/DeckInput';
import LogicInput from './components/LogicInput';

function App() {

  const asyncSim = useAsyncCallback(SimWorker)
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
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 200 }}>
            <Navbar.Section>
              <Space h="md" />
              <Center><Title>Decks</Title></Center>
              <Space h="md" />
            </Navbar.Section>
            {["Mister Negative","Galactus"].map(deckName => <>
              {/* <Navbar.Section>
                <Button fullWidth variant='outline'>{deck}</Button>
              </Navbar.Section> */}
              <NavLink label={deckName} description={deck.join(', ')} />
            </>)}
          </Navbar>}
        header={<Header height={60} p="xs">{/* Header content */}</Header>}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        <Container>
          <Grid>
            <Grid.Col span={12}>
                <TextInput label="Deck name" value={"Mister Negative"} />
            </Grid.Col>
            <Grid.Col span={3}><DeckInput deck={deck} onDeckChange={setDeck} /></Grid.Col>
            <Grid.Col span={9}><LogicInput deck={deck} onChange={setLogic} logic={logic} /></Grid.Col>

            <Grid.Col span={12}>
              We want the following cards on board:
              <MultiSelect data={deck} searchable value={expected} onChange={v => setExpected(v.map(v => v as CardName))} />
            </Grid.Col>

            <Grid.Col span={12}>
              <Group>
                <Button 
                    disabled={asyncSim.loading || deck.length !== 12}
                    onClick={e => asyncSim.execute({cards:deck, runs:runsCount, logic:logic, expected})}
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
        </Container>
      </AppShell>
    </MantineProvider>
  );
}

export default App;