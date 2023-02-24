import { useState } from 'react';
import './App.css';
import { CardName } from './data/cards';
import { AppShell, Center, Header, MantineProvider, Navbar, NavLink, Space, Title } from '@mantine/core';
import SimInput from './components/SimInput';
import { Deck } from './models/Deck';

function App() {

  // const [deckCards, setDeckCards] = useState<CardName[]>([])
  // const [decks, setDecks] = useState<string[]>([
  //   "Mister Negative",
  //   "Galactus",
  // ])
  const [decks, setDecks] = useState<Deck[]>([
    {
      name:"Mister Negative",
      cards:[
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
    },{
      name:"Galactus",
      cards:[
        "The Hood",
        "Psylocke",
        "Wolverine",
        "Electro",
        "Wave",
        "Shang-Chi",
        "Spider-Man",
        "Hobgoblin",
        "Knull",
        "Galactus",
        "America Chavez",
        "Death",
      ]
    }
  ])
  const [selectedDeck, setSelectedDeck] = useState(0)

  const setDeckCards = (cards:CardName[]) => {
    setDecks(decks => {
      const newDecks = [...decks]
      newDecks[selectedDeck].cards = cards
      return newDecks
    })
  }

  const setDeckName = (name:string) => {
    setDecks(decks => {
      const newDecks = [...decks]
      newDecks[selectedDeck].name = name
      return newDecks
    })
  }

  const addNewDeck = () => {
    const newDeck:Deck = {
      name: "New deck",
      cards: [],
    }
    const newDeckIndex = decks.length
    setDecks([...decks, newDeck])
    setSelectedDeck(newDeckIndex)
  }

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
            {decks.map((deck, i) => <>
              <NavLink 
                key={deck.name} 
                label={deck.name} 
                description={deck.cards.join(', ')} 
                active={selectedDeck === i}
                onClick={e => setSelectedDeck(i)}
              />
            </>)}
            <NavLink label={"Add new deck"} onClick={addNewDeck} />
          </Navbar>}
        header={<Header height={60} p="xs">{/* Header content */}</Header>}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        <SimInput deck={decks[selectedDeck]} onDeckChange={setDeckCards} onNameChange={setDeckName} />
      </AppShell>
    </MantineProvider>
  );
}

export default App;