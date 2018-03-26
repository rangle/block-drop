import * as React from 'react';
import {
  emptyTile,
  tileByNumber,
} from '../../styles';


export function Tile(props) {
  return (
    <div className={ props.value === 0 ? emptyTile : tileByNumber(props.value)}></div>
  );
}
