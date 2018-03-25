import * as React from 'react';
import { Tile } from './';
import {
  board,
  flex,
  flexGrowRow,
  flexNoWrap,
} from '../../styles';

export function Board(props) {
  const jsx = boardToJsx(props.board, props.width);
  return (
    <div className="ba bw2 b--react-blue mr4 shadow-react-blue">
      <h3 className="black bg-react-blue f3 mb0 mt0 tc">LEVEL {props.level}</h3>
      <div style={ props.styles } className={ board }>
        {
          jsx.map((el, i) => (
          <div key={i} className={ flexGrowRow }>{ el }</div>))
        }
      </div>
    </div>
    );
}

function boardToJsx(board: number[], width): number[][] {
  const cols = [];
  let row;
  board.forEach((el, i) => {
    if (i % width === 0) {
      row = [];
    }
    row.push(<Tile key={i} value={el}></Tile>);
    if (row.length === width) {
      cols.push(row);
    }
  });
  return cols;
}
