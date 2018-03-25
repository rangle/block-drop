import * as React from 'react';
import { Block } from './block';
import {
  flexCol,
  flexGrowShrink,
} from '../../styles';

export function NextPieces({ preview }) {

  return (
    <div className="ba bw2 b--react-blue mb4 shadow-react-blue">
      <h3 className="black bg-react-blue f3 mb0 mt0 tc">NEXT</h3>
      <div className="ph3 pv3">
        {
          preview.map((block, i) => (
            <Block key={i} block={ block } />
            )
          )
        }
      </div>
    </div>
  );
}
