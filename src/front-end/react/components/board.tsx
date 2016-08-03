import * as React from 'react';
import { Tile } from './';
import { boardStyle } from '../../styles';

export function Board(props) {
    return (
      <div>
          <div className='bd-float'>rows: { props.game.rowsCleared }</div>
          <div className={ boardStyle }>
              { props.board
                .map((el, i) => (<Tile key={i} value={el}></Tile>)) }
          </div>
      </div>);
}
