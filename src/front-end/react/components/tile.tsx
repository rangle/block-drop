import * as React from 'react';
import {
  activeTile,
  emptyTile,
} from '../../styles';


export function Tile(props) {
  return (<div className={ 
    props.value === 0 ? emptyTile : activeTile
  }>{ props.value }</div>);
}
