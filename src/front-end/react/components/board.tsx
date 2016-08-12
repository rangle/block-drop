import * as React from 'react';
import { Tile } from './';
import { board, flexGrowRow } from '../../styles';
import {
  flex,
  flexNoWrap,
} from '../../styles';

const gameViewportClass = `${flex} ${flexNoWrap}`;

export function Board(props) {
  const jsx = boardToJsx(props.board, props.width);
  return (
    <div style={ props.styles } className={ board }>
      {
        jsx.map((el, i) => (
        <div key={i} className={ flexGrowRow }>{ el }</div>))
      }
    </div>);
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
