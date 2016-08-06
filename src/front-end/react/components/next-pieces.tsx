import * as React from 'react';
import { Block } from './block';

export function NextPieces({ preview }) {

  return (<div className='bd-float'>
    <h2>Next:</h2>
    { preview.map((block, i) => (
      <Block key={i} block={ block } />
    )) }
  </div>);
}
