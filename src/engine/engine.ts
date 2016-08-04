/**
 * Orchestrates all the moving parts
 */
import {
  debugBlock,
  move,
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

import { DEFAULT_CONFIG_1 } from './configs/default-config';

import { createEventEmitter } from './event';

import {
  Block,
  Board,
  GameConfig,
  NextBlockConfig,
  RandomMethod,
} from '../interfaces';

import '../license';

import {
  between,
  randomSet,
} from './random';

import {
  copyBuffer,
  createReadOnlyApiTo,
  deepFreeze,
  noop,
  partial,
} from '../util';


/**
 * Partially applies the invocation (and ultimately result) of one or more 
 * functions to the first parameters of a new function which is returned.  
 * Trailing arguments are honored. 
 */
export function paramsToFn<T>(params: Function[], fn: Function) {
  return <T>(...args) => {
    return fn(...params.map(f => f()), ...args); 
  };
}

export function create1(config: GameConfig = {}) {
  const engine = Object.create(null);
  
  const c = deepFreeze(validateConfig(DEFAULT_CONFIG_1, config));
  const events = createEventEmitter();
  const board = c.createBoard(c.width, c.height);
  const preview = [];
  const nextBlock = createNextBlock(c, preview);
  const writableState = {
    games: [
      createGame1(nextBlock),  
    ],
    gameOvers: 0,
    rowsCleared: 0,
    timer: null,
  };
  const state = createReadOnlyApiTo(writableState);
  const buffer = Uint8Array.from(board.desc);
  const getActivePiece = () => writableState.games[0].activePiece;
  const getBoard = () => board;
  const getBuffer = () => buffer;
  const blockFn = partial<(f: Function) => Function>(paramsToFn, 
    [getActivePiece]);
  const boardBlockFn = partial<(f: Function) => Function>(paramsToFn, 
    [getBoard, getActivePiece]);
  const updateActiveBlock = partial<(fn: Function) => void>(updateBlock,
    getBoard, getActivePiece, getBuffer);
  const bCanMoveDown = boardBlockFn<() => boolean>(canMoveDown);
  const bCanMoveUp = boardBlockFn<() => boolean>(canMoveUp);
  const bCanMoveLeft = boardBlockFn<() => boolean>(canMoveLeft);
  const bCanMoveRight = boardBlockFn<() => boolean>(canMoveRight);
  const bCanRotateLeft = boardBlockFn<() => boolean>(c.canRotateLeft);
  const bCanRotateRight = boardBlockFn<() => boolean>(c.canRotateRight);
  const bRotateLeft = blockFn(rotateLeft);
  const bRotateRight = blockFn(rotateRight);
  const bMove: (axis: 'x' | 'y', quantity?: number) => any = blockFn(move);
  const moveDown = partial(bMove, 'y', 1);
  const moveLeft = partial(bMove, 'x', -1);
  const moveUp = partial(bMove, 'y', -1);
  const moveRight = partial(bMove, 'x', 1);

  Object.defineProperties(engine, {
    activePieceHistory: {
      configurable: false,
      get: () => writableState.games[0].activePieceHistory.slice(0),
      set: noop,
    },
    activePiece: {
      configurable: false,
      writable: false,
      value: getActivePiece,
    },
    buffer: {
      configurable: false,
      get: getBuffer,
      set: noop,  
    },
    clean: {
      configurable: false,
      writable: false,
      value: () => {
        clearInterval(writableState.timer);
      },
    },
    config: {
      configurable: false,
      writable: false,
      value: c,
    },
    controls: {
      configurable: false,
      writable: false,
      value: Object.create(null, {
        moveDown: {
          configurable: false,
          writable: false,
          value: partial<() => void>(tryFnRedraw,
              bCanMoveDown,
              partial(updateActiveBlock, moveDown),
              events.emit
            ),
        },
        moveLeft: {
          configurable: false,
          writable: false,
          value: partial<() => void>(tryFnRedraw,
              bCanMoveLeft,
              partial(updateActiveBlock, moveLeft),
              events.emit
            ),
        },
        moveRight: {
          configurable: false,
          writable: false,
          value: partial<() => void>(tryFnRedraw,
              bCanMoveRight,
              partial(updateActiveBlock, moveRight),
              events.emit
            ),
        },
        moveUp: {
          configurable: false,
          writable: false,
          value: partial<() => void>(tryFnRedraw,
              bCanMoveUp,
              partial(updateActiveBlock, moveUp),
              events.emit
            ),
        },
        rotateLeft: {
          configurable: false,
          writable: false,
          value: partial<() => void>(tryFnRedraw,
              bCanRotateLeft, partial(updateActiveBlock, bRotateLeft),
              events.emit
            ),
        },
        rotateRight: {
          configurable: false,
          writable: false,
          value: partial<() => void>(tryFnRedraw,
              bCanRotateRight,
              partial(updateActiveBlock, bRotateRight),
              events.emit
            ),
        },
        state: {
          configurable: false,
          writable: false,
          value: state,
        }
      }),
    },
    gameOver: {
      configurable: false,
      writable: false,
      value: partial(gameOver, c.debug, getBoard, getBuffer, writableState, 
        nextBlock, events.emit),
    },
    gamesOvers: {
      configurable: false,
      get: () => writableState.gameOvers,
      set: noop,
    },
    on: {
      configurable: false,
      writable: false,
      value: events.on,
    },
    emit: {
      configurable: false,
      writable: false,
      value: events.emit,
    },
    preview: {
      configurable: false,
      writable: false,
      value: preview,
    },
    rowsCleared: {
      configurable: false,
      get: () => writableState.games[0].rowsCleared,
      set: noop,
    },
  });
  
  // go
  addBlock(board, getActivePiece(), buffer);
  
  function newBlock() {
    writableState.games[0].activePieceHistory.unshift(getActivePiece());
    writableState.games[0].activePiece = nextBlock();
    if (c.debug) {
      debugBlock('New Piece:', getActivePiece());
    }
    addBlock(board, getActivePiece(), buffer);
  }
  
  function bClearCheck() {
    writableState.games[0].rowsCleared +=
      clearCheck(engine, board, partial(c.detectAndClear, board),
        c.forceBufferUpdateOnClear);
  }
  
  const commitBlock = boardBlockFn<() => void>(addBlock);
  const checkForLoss = boardBlockFn<() => void>(c.checkForLoss);

  writableState.timer = setInterval(() => {
    c.tick(engine, 
      board, 
      (axis: 'x' | 'y', quantity: number) => { 
        updateActiveBlock(() => bMove(axis, quantity));
      },
      newBlock, 
      bClearCheck, 
      commitBlock,
      checkForLoss, 
      c.gameOver);
  }, c.speed);

  return engine;
}

function createGame1(nextBlock) {
  return {
    activePieceHistory: [],
    activePiece: nextBlock(), 
    rowsCleared: 0,
    tilesCleared: 0, 
  }; 
}

export function createNextBlock(c: NextBlockConfig, 
                                previewContainer: Block[] = []) {

  const blocks = c.blockDescriptions
    .map((el) => c.createBlock(el.desc, 0, 0, el.name));
  const rand = c.seedRandom(c.seed);
  const spawn: (block: Block) => Block = partial(c.spawn, c.width, c.height);
  
  const randomBlock: () => Block = c.randomMethod === RandomMethod.Random ?
    () => blocks[between(rand, blocks.length)] :
    randomSet(rand, blocks);
  
  if (c.preview <= 0) {
    return () => spawn(randomBlock());
  }
  
  const max = c.preview > blocks.length ? blocks.length : c.preview;
  
  for (let i = 0; i < max; i += 1) {
    previewContainer.push(randomBlock());
  }
  
  return () => {
    previewContainer.push(randomBlock());
    return spawn(previewContainer.shift());
  };
}
export function clearCheck(engine: { rowsCleared: number, buffer: Uint8Array },
                           board: Board,
                           detectAndClear: () => number,
                           forceBufferCopy: boolean) {
  const cleared = detectAndClear();
  engine.rowsCleared += cleared;
  if (cleared || forceBufferCopy) { copyBuffer(board.desc, engine.buffer); }
  return cleared;
}

export function gameOver(isDebug: boolean,
                         getBoard: () => Board,
                         getBuffer: () => Uint8Array,
                         writableState: { games: any[], gameOvers: number },
                         nextBlock: () => Block,
                         emit: (message: string) => any) {
  const board = getBoard();
  const buffer = getBuffer();
  if (isDebug) {
    /* tslint:disable no-console */
    const { rowsCleared } = writableState.games[0];
    console.log('Game Over: Purging Game:');
    console.log(`Rows Cleared: ${rowsCleared}`);
    console.log('Piece History:', writableState.games[0]
      .activePieceHistory.map(i => i));
    console.log('End Board', board.desc);
    debugBlock('Last Active Piece: ', writableState.games[0].activePiece);
  }
  writableState.gameOvers += 1;
  writableState.games.unshift(createGame1(nextBlock));

  board.desc.forEach((el, i) => {
    board.desc[i] = 0;
    buffer[i] = 0;
  });

  emit('game-over');
}

export function updateBlock(getBoard: () => Board,
                            getBlock: () => Block,
                            getBuffer: () => Uint8Array,
                            fn: () => any) {
  const block = getBlock();
  const board = getBoard();
  const buffer = getBuffer();
  removeBlock(board, block, buffer);
  fn();
  addBlock(board, block, buffer);
}

export function tryFnRedraw(canFn: () => boolean,
                            fn: () => any,
                            emit: (msg: string) => any) {
  if (canFn()) {
    fn();
    emit('redraw');
  } else {
    emit('invalid-move');
  }
}

export function validateConfig(defaults: GameConfig, 
                               config: any = {}): GameConfig {
  Object.keys(defaults).forEach((prop) => {
    config[prop] = config[prop] === undefined ? defaults[prop] : config[prop];
  });
  
  config.seed = config.seed || Date.now();
  
  return config;
}
