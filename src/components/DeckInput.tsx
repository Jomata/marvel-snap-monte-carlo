import {
  Button,
  Select,
} from "@mantine/core";
import { useState } from "react";
import { CardID, cardIDtoName, CardName, CARD_NAMES } from "../data/cards";
import { decode } from "marvel-snap-deckstrings";
import { showNotification } from '@mantine/notifications';

export type DeckInputProps = {
    deck:CardName[],
    onDeckChange:(deck:CardName[]) => void
}

export default function DeckInput({
    deck,
    onDeckChange,
}:DeckInputProps) {
    const [focusedInput, setFocusedInput] = useState<number | undefined>(undefined)
    const handleSelectChange = (index: number, value: CardName) => {
      //TODO: Focus next input after select
      const newValues = [...deck];
      newValues[index] = value;
      setFocusedInput(index+1);
      onDeckChange(newValues);
    };
    const handlePaste = async () => {
      try {
        const text = await navigator.clipboard.readText();
        const decodedDeck = decode(text)
        const newDeck = decodedDeck.cards.map(c => cardIDtoName(c as CardID)).filter(cn => cn !== undefined)
        onDeckChange(newDeck)
        if(newDeck.length === 12) {
          showNotification({
            message: 'Import completed',
            color:'blue',
          })
        } else {
          showNotification({
            message: 'Import partially succeeded',
            color:'yellow',
          })
        }
      } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        showNotification({
          message: 'Import failed',
          color:'red',
        })
      }
    }

    return (<>
      <Button size="xs" fullWidth={true} onClick={handlePaste}>Import from clipboard</Button>
      {Array(12).fill('').map((_, i) => (<Select
        key={i}
        data={CARD_NAMES.map(c => ({ value: c, label: c, disabled: deck.some(dc => dc === c && c !== deck.at(i)) }))}
        searchable
        placeholder={`Choose card #${i} for your deck`}
        onChange={v => handleSelectChange(i, v as CardName)}
        value={deck.at(i)}
        disabled={deck.length < i}
        initiallyOpened={i === focusedInput}
        autoFocus={i === focusedInput}
        size="xs"
    />))}
    </>)
}