import { Grid, MultiSelect } from "@mantine/core";
import React from "react";
import { useState } from "react";
import { CardName } from "../data/cards";
import { CardPriority } from "../models/Sim";

type TurnNumber = keyof CardPriority

export type LogicInputProps = {
    deck: CardName[],
    logic:CardPriority,
    onChange:(logic:CardPriority) => void,
}

export default function LogicInput({
    deck,
    logic,
    onChange,
}:LogicInputProps) {
    const setTurnLogic = (turn:TurnNumber, cardNames:string[]) => {
        const cards = cardNames.map(c => c.trim() as CardName)
        const newLogic = {
            ...logic, 
            [turn]: cards
        }
        onChange(newLogic)
    }

    return (
        <Grid>
            {Object.entries(logic).map(([k, v]) => {
                const turn = k as TurnNumber
                const cards = v as CardName[]
                return <React.Fragment key={k}>
                    <Grid.Col span={2}>{k}</Grid.Col>
                    <Grid.Col span={10}><MultiSelect
                        data={deck}
                        searchable
                        placeholder="Choose which cards to play"
                        value={cards}
                        onChange={value => setTurnLogic(turn, value)}
                    /></Grid.Col>
                </React.Fragment>
            })}
        </Grid>
    )
}