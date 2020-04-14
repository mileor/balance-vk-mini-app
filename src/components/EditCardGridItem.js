import React from "react";
import {
  Cell, CardGrid, Card
} from '@vkontakte/vkui';

import Icon28WriteSquareOutline from '@vkontakte/icons/dist/28/write_square_outline';

export default function EditCardGridItem(props) {
  return (

    props.isRemovable ?
      <CardGrid>
        <Card size="l" mode="outline">
          <div style={{ padding: 8 }}>
            <Cell removable onRemove={props.onRemove}>
              {props.cardName}
            </Cell>
          </div>
        </Card>
      </CardGrid>
      : <CardGrid onClick={props.onClick}>
        <Card size="l" mode="outline">
          <div style={{ padding: 8 }}>
            <Cell indicator={<Icon28WriteSquareOutline width={20} height={20} />}>
              {props.cardName}
            </Cell>
          </div>
        </Card>
      </CardGrid>

  )
}