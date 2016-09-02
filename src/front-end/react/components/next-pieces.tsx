import * as React from 'react';
import { Block } from './block';
import {
  flexCol,
  flexGrowShrink,
} from '../../styles';

export function NextPieces({ preview }) {

  return (<div className={ `${flexGrowShrink} ${flexCol}` }>
    <h3>Next:</h3>
    { preview.map((block, i) => (
      <Block key={i} block={ block } />
    )) }
  </div>);
}
