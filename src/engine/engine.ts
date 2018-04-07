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
  DC2MAX,
  functionsDetectClear,
  removeBlock,
} from './board';

import { DEFAULT_CONFIG_1 } from './configs/default-config';

import { createEventEmitter } from '../event';

import {
  Block,
  Board,
  GameConfig,
  GameState,
  NextBlockConfig,
} from '../interfaces';

import '../license';

import {
  between,
  functions as randomFunctions,
  randomSet,
} from './random';

import {
  copyBuffer,
  createReadOnlyApiTo,
  deepFreeze,
  noop,
  partial,
} from '../util';

export { configInterfaces } from './configs/config-interfaces';

export function create1state(conf: GameConfig) {
  const board = conf.createBoard(conf.width, conf.height);
  const buffer = Uint8Array.from(board.desc);

  return {
    activePiece: null,
    board,
    buffer,
    conf,
    games: [{ level: 1, score: 0 }],
    preview: [],
  };
}

export function create1Controls() {
  return Object.create(null, {
    moveDown: {
      configurable: false,
      value: noop,
    },
    moveLeft: {
      configurable: false,
      value: noop,
    },
    moveRight: {
      configurable: false,
      value: noop,
    },
    moveUp: {
      configurable: false,
      value: noop,
    },
    rotateLeft: {
      configurable: false,
      value: noop,
    },
    rotateRight: {
      configurable: false,
      value: noop,
    },
  });
}

export function create1(optionsConfig: GameConfig = {}) {
  const obj = Object.create(null);
  const conf = deepFreeze(forceValidateConfig(DEFAULT_CONFIG_1, optionsConfig));
  const state = create1state(conf);
  const events = createEventEmitter();

  /** Public API */
  Object.defineProperties(obj, {
    activePiece: {
      configurable: false,
      value: () => state.activePiece,
    },
    buffer: {
      configurable: false,
      get: () => state.buffer,
      set: noop,  
    },
    config: {
      configurable: false,
      value: conf,
    },
    controls: {
      configurable: false,
      value: create1Controls(),
    },
    endGame: {
      configurable: false,
      value: noop,
    },
    level: {
      configurable: false,
      get: () => state.games[0].level,
      set: noop,
    },
    on: {
      configurable: false,
      value: events.on,
    },
    pause: {
      configurable: false,
      value: () => noop,
    },
    preview: {
      configurable: false,
      value: state.preview,
    },
    score: {
      configurable: false,
      get: () => state.games[0].score,
      set: noop,
    },
    startGame: {
      configurable: false,
      value: noop,
    },
  });
  return obj;
}

export function forceValidateConfig(defaults: GameConfig,
                                    config: any = {}): GameConfig {
  Object.keys(defaults).forEach((prop) => {
    config[prop] = config[prop] === undefined ? defaults[prop] : config[prop];
  });
  
  config.seed = config.seed || Date.now();
  
  return config;
}

export function createNextBlock(
  c: NextBlockConfig,
  previewContainer: Block[] = [],
) { 
  const blocks = c.blockDescriptions
    .map((el) => c.createBlock(el.desc, 0, 0, el.name));
  const rand = randomFunctions.get(c.seedRandom)(c.seed);
  const spawn: (block: Block) => Block = partial(c.spawn, c.width, c.height);
  
  const randomBlock: () => Block = c.randomMethod === 'random' ?
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
