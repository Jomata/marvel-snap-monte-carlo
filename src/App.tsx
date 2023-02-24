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
import SimInput from './components/SimInput';

function App() {

  const [deckCards, setDeckCards] = useState<CardName[]>([])
  const [decks, setDecks] = useState<string[]>([
    "Mister Negative",
    "Galactus",
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
            {decks.map(deckName => <>
              <NavLink key={deckName} label={deckName} description={deckCards.join(', ')} />
            </>)}
          </Navbar>}
        header={<Header height={60} p="xs">{/* Header content */}</Header>}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        <SimInput selectedDeck={decks[0]} onDeckChange={setDeckCards} onNameChange={newName => setDecks([newName, 'Galactus'])} />
      </AppShell>
    </MantineProvider>
  );
}

export default App;