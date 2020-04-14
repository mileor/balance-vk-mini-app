import React from "react";
import {
  Cell, CardGrid, Card
} from '@vkontakte/vkui';

export default function AddCardGridItem(props) {
  return (
    <CardGrid onClick={props.onClick}>
      <Card size="l">
        <div style={{ padding: 8, fontWeight: "bold" }}>
          <Cell expandable>{props.cardName}</Cell>
        </div>
      </Card>
    </CardGrid>
  )
}