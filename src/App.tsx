import { useState } from 'react';
import './App.css';
import { CardName } from './data/cards';
import { AppShell, Center, Header, MantineProvider, Navbar, NavLink, ScrollArea, Space, Title } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import SimInput from './components/SimInput';
import { Deck } from './models/Deck';
import { useLocalStorage, randomId } from '@mantine/hooks';

function App() {
  //mantine hooks has a randomId() method
  const [decks, setDecks] = useLocalStorage<Deck[]>({key: 'casino_decks', defaultValue: [
    {
      id: 'sample_negative',
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
      id: 'sample_galactus',
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
  ]})
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
      id: "deck_" + randomId(),
      name: "New deck",
      cards: [],
    }
    const newDeckIndex = decks.length
    setDecks([...decks, newDeck])
    setSelectedDeck(newDeckIndex)
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
      <NotificationsProvider position="bottom-left">
        <AppShell
          padding="md"
          navbar={
            <Navbar width={{ base: 200 }}>
              {/* <Navbar.Section>
                <Space h="md" />
                <Center><Title>Decks</Title></Center>
                <Space h="md" />
              </Navbar.Section> */}
              <Navbar.Section grow component={ScrollArea}>
                <NavLink label={"Add new deck"} onClick={addNewDeck} />
                {decks.map((deck, i) => <>
                  <NavLink 
                    key={deck.id} 
                    label={deck.name} 
                    description={deck.cards.join(', ')} 
                    active={selectedDeck === i}
                    onClick={e => setSelectedDeck(i)}
                  />
                </>)}
              </Navbar.Section>
            </Navbar>}
          header={<Header height={80} p="md">
            <Center>
              <Title>Welcome to Agatha's Casino</Title>
            </Center>
          </Header>}
          styles={(theme) => ({
            main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
          })}
        >
          {decks.map((deck, i) => <>
            {selectedDeck === i && <SimInput key={i} deck={decks[selectedDeck]} onDeckChange={setDeckCards} onNameChange={setDeckName} />}
          </>)}
        </AppShell>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;