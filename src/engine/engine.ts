/**
 * Orchestrates all the moving parts
 */
import {
  rotateLeft,
  rotateRight,
} from './block';

import {
  addBlock,
  canMoveDown,
  canMoveUp,
  canMoveLeft,
  canMoveRight,
  removeBlock,
} from './board';


import { DEFAULT_CONFIG_1 } from './default-config';

import { createEventEmitter } from './event';

import {
  Block,
  Board,
  GameConfig,
  RandomMethod,
} from './interfaces';

import {
  between,
  randomSet,
} from './random';

import {
  deepFreeze,
} from './util';

export function create1(config: GameConfig = {}) {
  const engine = Object.create(null);
  
  const c = deepFreeze(validateConfig(DEFAULT_CONFIG_1, config));
  engine.config = c;
  
  const events = createEventEmitter();
  engine.on = events.on;
  engine.emit = events.emit;
  
  const board = c.createBoard(c.width, c.height);
  engine.buffer = Uint8Array.from(board.desc);
  engine.rowsCleared = 0;
  
  const blocks = c.blockDescriptions
    .map((el) => c.createBlock(el.desc, 0, 0, el.name));
  const rand = c.seedRandom(c.seed);
  const spawn: (block: Block) => Block = c.spawn.bind(null, c.width, c.height);
  const nextBlock: () => Block = c.randomMethod === RandomMethod.Random ?
    () => spawn(blocks[between(rand, blocks.length)]) :
    createNextBlockRandomSet(spawn, blocks, rand);
  
  // go
  engine.activePiece = nextBlock();
  addBlock(board, engine.activePiece, engine.buffer);
  
  const timer = setInterval(() => {
    tick1(engine, board, nextBlock, c.detectAndClear);
  }, c.speed);

  const listeners = [
    events.on('left', () => {
      tryAndMoveBlock(engine, board, canMoveLeft, 'x', -1);
    }),

    events.on('right', () => {
      tryAndMoveBlock(engine, board, canMoveRight, 'x', 1);
    }),

    events.on('down', () => {
      tryAndMoveBlock(engine, board, canMoveDown, 'y', 1);
    }),
    
    events.on('up', () => {
      tryAndMoveBlock(engine, board, canMoveUp, 'y', -1);
    }),

    events.on('rotateLeft', () => {
      tryAndRotateBlock(engine, board, rotateLeft, c.canRotateLeft);
    }),
    
    events.on('rotateRight', () => {
      tryAndRotateBlock(engine, board, rotateRight, c.canRotateRight);
    }),
  ];

  engine.clean = () => {
    clearInterval(timer);
    listeners.forEach((l) => l());
  };
  
  return engine;
}

export function tick1(engine, 
                      board: Board, 
                      nextBlock: () => Block,
                      detectAndClear: (board: Board) => number) {
  if (!canMoveDown(board, engine.activePiece)) {
    commitBlock(engine, board, nextBlock);
    clearCheck(engine, board, detectAndClear);
    if (!canMoveDown(board, engine.activePiece)) {
      // game over
      gameOver1(engine, board, nextBlock);
    }
  } else {
    moveBlock(board, engine.activePiece, 'y', 1, engine.buffer);
  }
  engine.emit('render');
  engine.emit('drop');
}

export function gameOver1(engine, board: Board, nextBlock) {
  engine.emit('game-over');
  board.desc.map(() => 0);
  engine.buffer.forEach((el, i) => engine.buffer[i] = 0);
  engine.activePiece = nextBlock();
  addBlock(board, engine.activePiece, engine.buffer);
}

export function clearCheck(engine, board: Board, detectAndClear) {
  const cleared = detectAndClear(board);
  engine.rowsCleared += cleared;
  if (cleared) { engine.buffer
    .forEach((el, i) => engine.buffer[i] = board.desc[i]); }
}

export function commitBlock(engine, board: Board, nextBlock) {
  addBlock(board, engine.activePiece);
  engine.activePiece = nextBlock();
  addBlock(board, engine.activePiece, engine.buffer);
}

export function tryAndRotateBlock(engine,
                                  board: Board,
                                  rotateFn: (block: Block) => any,
                                  canRotateFn: (board: Board, 
                                                block: Block) => any) {
  const can = canRotateFn(board, engine.activePiece);

  if (can) {
    rotateBlock(board, engine, rotateFn);
    engine.emit('render');
  } else {
    engine.emit('invalid-move');
  }
  
}

export function rotateBlock(board: Board, 
                            engine, 
                            rotateFn: (block: Block) => any) {
  removeBlock(board, engine.activePiece, engine.buffer);
  rotateFn(engine.activePiece);
  addBlock(board, engine.activePiece, engine.buffer);
}


export function tryAndMoveBlock(engine,
                                board: Board,
                                canFn: (board: Board, block: Block) => boolean,
                                axis: 'x' | 'y',
                                quantity = 1) {
  const can = canFn(board, engine.activePiece);

  if (can) {
    moveBlock(board, engine.activePiece, axis, quantity, engine.buffer);
    engine.emit('render');
  } else {
    engine.emit('invalid-move');
  }
}

export function moveBlock(board: Board, 
                          block: Block, 
                          axis: 'x' | 'y', 
                          quantity = 1,
                          buffer = board.desc) {
  removeBlock(board, block, buffer);
  block[axis] += quantity;
  addBlock(board, block, buffer);
}

export function createNextBlockRandomSet(spawn: Function,
                               collection: any[],
                               rand: () => number) {
  const next = randomSet(rand, collection);

  return () => spawn(next());
}

export function validateConfig(defaults: GameConfig, 
                               config: any = {}): GameConfig {
  Object.keys(defaults).forEach((prop) => {
    config[prop] = config[prop] === undefined ? defaults[prop] : config[prop];
  });
  
  config.seed = config.seed || Date.now();
  
  return config;
}
