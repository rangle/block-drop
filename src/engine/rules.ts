import { 
  up, 
} from './block';

import {
  canMoveDown,
} from './board';

import { 
  Block,
  Board,
} from './interfaces';

import { 
  intMidFloor,
  invertBoolean,
} from './util';

export function gameOver1(engine: { gameOver: () => any }, board?: Board) {
  // must call game over when done
  engine.gameOver();
}

export const checkForLoss1 = invertBoolean(canMoveDown);

export function spawn1(width: number, height: number, block: Block): Block {
  up(block);
  block.x = intMidFloor(width);
  block.y = 0;

  return block;
}

export function tick1(engine,
                      board: Board,
                      moveBlock: (axis: 'x' | 'y', mag: number) => any,
                      newBlock: () => any,
                      clearCheck: () => any,
                      commitBlock: () => any,
                      checkForLoss: () => boolean,
                      gameOver: (engine?: { gameOver: () => any}, 
                                 board?: Board) => any) {
  if (!canMoveDown(board, engine.activePiece())) {
    commitBlock();
    newBlock();
    clearCheck();
    if (checkForLoss()) {
      // game over
      gameOver(engine, board);
    }
  } else {
    moveBlock('y', 1);
  }
  engine.emit('redraw');
  engine.emit('drop');
}

