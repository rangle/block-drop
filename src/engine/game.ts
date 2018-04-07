import {
  addBlock,
  canMoveDown,
  canMoveUp,
  canMoveLeft,
  canMoveRight,
  DC2MAX,
  functionsDetectClear,
  removeBlock,
} from './board';
import {
  Block,
  Board,
  GameConfig,
  GameState,
  NextBlockConfig,
} from '../interfaces';
import {
  copyBuffer,
  createReadOnlyApiTo,
  deepFreeze,
  noop,
  partial,
} from '../util';

export function clearCheck(engine: { rowsCleared: number, buffer: Uint8Array },
                           board: Board,
                           detectAndClear: () => number,
                           forceBufferCopy: boolean) {
  const cleared = detectAndClear();

  if (cleared || forceBufferCopy) { copyBuffer(board.desc, engine.buffer); }

  return cleared;
}

export function updateBlock(getBoard: () => Board,
                            getBlock: () => Block,
                            getBuffer: () => Uint8Array,
                            enableShadow: boolean,
                            fn: () => any,
                          ) {
  const block = getBlock();
  const board = getBoard();
  const buffer = getBuffer();
  removeBlock(board, block, buffer, enableShadow);
  fn();
  addBlock(board, block, buffer, enableShadow);
}

export function createGame1(
  conf: GameConfig, 
  emit,
  nextBlock,
  gameOver,
) {
  const game = {
    activePieceHistory: [],
    activePiece: nextBlock(), 
    endGame: () => {
      console.log('end game');
      game.isEnded = true;
    },
    isEnded: false,
    level: 1,
    levelPrev: 1,
    moveDown: console.log.bind(console, 'down'),
    moveLeft: console.log.bind(console, 'left'),
    moveRight: console.log.bind(console, 'right'),
    moveUp: console.log.bind(console, 'up'),
    nextLevelThreshold: 45,
    rotateLeft: console.log.bind(console, 'rotate left'),
    rotateRight: console.log.bind(console, 'rotate right'),
    rowsCleared: 0,
    rowsClearedPrev: 0,
    score: 0,
    tick,
    tilesCleared: 0, 
    tilesClearedPrev: 0,
  }; 
  return game;
}

function deriveMultiple(level: number, multiplier: number, value: number) {
  if (level <= 1) {
    return value * multiplier;
  }
  return deriveMultiple(level - 1, multiplier, value) * multiplier;
}


function tick(delta: number, conf: GameConfig, game, nextBlock) {
  if (game.isEnded) {
    return;
  }
  const interval = deriveMultiple(game.level, conf.speedMultiplier, conf.speed);
  if (delta < interval) {
    return false;
  }
  console.log('tick', delta, interval);
  return true;
}
