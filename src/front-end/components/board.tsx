import * as React from 'react';
import { Tile } from './';

export function Board(props) {
    return (
      <div>
          <div className='bd-float'>rows: { props.game.rowsCleared }</div>
          <div className='bd-clear bd-game bd-border bd-border-white bd-float'>
              { props.board
                .map((el, i) => (<Tile key={i} value={el}></Tile>)) }
          </div>
      </div>);
}
