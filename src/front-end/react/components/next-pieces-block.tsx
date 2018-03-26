import * as React from 'react';
import { columnsFromBlock } from '../../../engine/block';
import { Tile } from './tile';

export function NextPiecesBlock(props) {
  const cols = columnsFromBlock(props.block);

  return (
    <div>
      {
        cols.map((row, i) => (
          <div className="flex justify-center" key={i}>
            {
              row.map((tile, j) => (
                <div className={`flex h2 w2 ${j < (row.length - 1) ? 'mr2' : ''}`} key={j}>
                  <Tile value={tile} />
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  );
}
