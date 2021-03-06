import * as React from 'react';
import { NextPiecesBlock } from './next-pieces-block';

export function NextPieces({ preview }) {

  return <div className="ba bw2 b--react-blue mb4 shadow-react-blue">
      <h3 className="blue-black bg-react-blue f4 f2-m f1-l ma0 pt1 pt2-m pt3-l tc">
        NEXT
      </h3>
      <div className="pa2 pa3-ns flex flex-column-reverse">
        {preview.map((block, i) => (
          <div className={i !== 0 ? 'mb3' : ''} key={i}>
            {i === 0 && (
              <hr className="ma0 mb3 bn shadow-react-blue bg-react-blue h0-25" />
            )}
            <NextPiecesBlock block={block} />
          </div>
        ))}
      </div>
    </div>;
}
