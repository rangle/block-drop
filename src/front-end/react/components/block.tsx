import * as React from 'react';
import { columnsFromBlock } from '../../../engine/block';
import { Tile } from './tile';
import {
  flexGrowCol,
  flexGrowRow,
} from '../../styles';

export function Block(props) {
  const cols = columnsFromBlock(props.block);

  return (<div className={ flexGrowCol }>
      { props.block.name }
      {
        cols.map((row, i) => (<div className={ flexGrowRow } key={i}>
          { row.map((el, j) => (<Tile key={j} value={el} />)) }
        </div>))
      }
  </div>);
}
