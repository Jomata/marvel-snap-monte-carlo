import {
MultiSelect,
MultiSelectProps,
Box,
CloseButton,
MultiSelectValueProps,
} from "@mantine/core";
import { CardName, CARD_NAMES } from "../data/cards";

export type DeckInputProps = {
    deck:CardName[],
    onDeckChange:(deck:CardName[]) => void
}

export default function DeckInput({
    deck,
    onDeckChange,
}:DeckInputProps) {
    return (<MultiSelect
        data={CARD_NAMES}
        maxSelectedValues={12}
        valueComponent={Value}
        // itemComponent={Item}
        searchable
        // defaultValue={["US", "FI"]}
        placeholder="Choose cards for your deck"
        onChange={v => onDeckChange(v.map(c => c as CardName))}
        value={deck}
        wrapperProps={{"style":{"height":"12em"}}}
        initiallyOpened
        
    />)
}

function Value({
    value,
    label,
    onRemove,
    classNames,
    ...others
  }: MultiSelectValueProps & { value: string }) {
    return (
        <div style={{"width":"100%"}} {...others}>
        <Box
          sx={(theme) => ({
            display: "flex",
            cursor: "default",
            alignItems: "center",
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
            // border: `1px solid ${
            //   theme.colorScheme === "dark"
            //     ? theme.colors.dark[7]
            //     : theme.colors.gray[4]
            // }`,
            // paddingLeft: 10,
            // borderRadius: 4,
          })}
        >
          <CloseButton
            onMouseDown={onRemove}
            variant="transparent"
            size={22}
            iconSize={14}
            tabIndex={-1}
          />
          <Box sx={{ lineHeight: 1, fontSize: 12 }}>{label}</Box>
        </Box>
      </div>
    );
  }