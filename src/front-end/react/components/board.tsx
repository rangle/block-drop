import * as React from 'react';
import { Tile } from './';
import { flexGrowRow } from '../../styles';

export function Board(props) {
  const jsx = boardToJsx(props.board, props.width);
  return (
    <div className='ba bw2 b--react-blue mr2 mr4-ns flex flex-column shadow-react-blue w-two-thirds'>
      <h3 className='blue-black bg-react-blue f4 f2-m f1-l ma0 pt1 pt2-m pt3-l tc'>
        LEVEL {props.level}
      </h3>
      <div
        style={props.styles}
        className='bd-mono-font bd-flex bd-flex-3-1-auto bd-flex-nowrap bd-flex-justify-around bd-flex-col'
      >
        {jsx.map((el, i) => (
          <div key={i} className={flexGrowRow}>
            {el}
          </div>
        ))}
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
    row.push(<Tile key={i} value={el} />);
    if (row.length === width) {
      cols.push(row);
    }
  });
  return cols;
}
