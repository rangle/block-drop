import * as React from 'react';

const base = 'bd-float';
const activeTile = `${base} bd-tile-active bd-green bd-border bd-border-green`;
const emptyTile = `${base} bd-tile-empty bd-black`;

export function Tile(props) {
  return (<div className={ 
    props.value === 0 ? emptyTile : activeTile
  }>{ props.value }</div>);
}
