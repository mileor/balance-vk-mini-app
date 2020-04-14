import React from "react";
import {
  Cell, CardGrid, Card, Avatar
} from '@vkontakte/vkui';
import Icon28Play from '@vkontakte/icons/dist/28/play';
import Icon24Done from '@vkontakte/icons/dist/24/done';

const greenBackground = {
  backgroundColor: 'var(--dynamic_green)'
};

export default function BalanceCardGridItem(props) {
  return (
    <CardGrid onClick={props.onClick}>
      <Card size="l" style={props.isDone ? { backgroundColor: 'var(--im_bubble_expiring_highlighted)' } : null}>
        <div style={{ padding: 4 }}>
          {
            props.isDone ?
              <Cell
                before={<Avatar size={24} style={greenBackground}><Icon24Done fill="#fff" width={16} height={16} /></Avatar>}
              >
                {props.cardName}
              </Cell> :
              <span>
              <Cell
                indicator={<Icon28Play width={20} height={20}/>}
              >
                {props.cardName}
              </Cell>
                <div className="progress-bar">
                  <div className="progress-bar" style={{backgroundColor: props.cardProgressColor, width: props.cardProgressValue}}>
                  </div>
                </div>
              </span>
              

          }

        </div>
      </Card>
    </CardGrid>
  )
}