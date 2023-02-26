import {
Select,
} from "@mantine/core";
import { useState } from "react";
import { CardName, CARD_NAMES } from "../data/cards";

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

    return (<>
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