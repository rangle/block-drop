import * as React from 'react';
import { NextPiecesBlock } from './next-pieces-block';

export function NextPieces({ preview }) {

  return (
    <div className="ba bw2 b--react-blue mb4 shadow-react-blue">
      <h3 className="black bg-react-blue f3 mb0 mt0 tc">NEXT</h3>
      <div className="ph3 pv3">
        {
          preview.map((block, i) => (
            <div className={i < (preview.length - 1) ? 'mb3' : ''} key={i}>
              <NextPiecesBlock block={block} />
              {
                i === 0 && (
                  <div className="bb bw1 mt3" />
                )
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}
