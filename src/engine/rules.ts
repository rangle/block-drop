import { 
  up, 
} from './block';

import {
  canMoveDown,
} from './board';

import { 
  Block,
  Board,
  Game,
} from '../interfaces';

import { 
  intMidFloor,
  invertBoolean,
} from '../util';

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

export function tick1(
  game: Game,
  delta: number,
) {
  if (game.state.isEnded) {
    return;
  }
  const { buffer, conf, level } = game.state;
  const interval = deriveMultiple(
    level, conf.speedMultiplier, conf.speed
  );
  if (delta < interval) {
    return false;
  }

  if (game.state.conf.canMoveDown(game.board, game.state.activePiece)) {
    game.moveBlock('y', 1);
    game.emit('redraw');
  } else {
    game.addBlock(game.board, game.state.activePiece, game.board.desc, false);
    game.newBlock();
    game.clearCheck(
      buffer, game.board, game.detectAndClear, conf.forceBufferUpdateOnClear
    );
    if (conf.checkForLoss(game.board, game.state.activePiece)) {
      // game over
      game.gameOver();
    } else {
      game.moveBlock('y', 1);
    }
    game.emit('redraw');
    game.emit('drop');
  }
  return true;
}

function deriveMultiple(level: number, multiplier: number, value: number) {
  if (level <= 1) {
    return value * multiplier;
  }
  return deriveMultiple(level - 1, multiplier, value) * multiplier;
}
