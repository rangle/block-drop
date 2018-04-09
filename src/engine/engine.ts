/**
 * Public API:
 *   - create1() creates an engine
 * 
 * The engine is a stateful object that manages a series of games
 * 
 * Core Responsibilities:
 * - Maintain the integrity of gameplay
 *   - Maintain random seed
 *   - Maintain validated/frozen config
 * - Facilitate realtime game play (ie control iteration/steps)
 * - Validate historical game play
 */
import {
  functionsDetectClear,
} from './board';

import { DEFAULT_CONFIG_1 } from './configs/default-config';

import { createEventEmitter } from '../event';

import {
  Block,
  GameConfig,
  NextBlockConfig,
} from '../interfaces';

import '../license';

import {
  between,
  functions as randomFunctions,
  randomSet,
} from './random';

import {
  deepFreeze,
  noop,
  partial,
} from '../util';
import { createGame1 } from './game';

export { configInterfaces } from './configs/config-interfaces';

export function create1state(conf: GameConfig) {
  const board = conf.createBoard(conf.width, conf.height);
  const buffer = Uint8Array.from(board.desc);

  return {
    activePiece: null,
    board,
    buffer,
    conf,
    games: [],
    history: [],
    pauses: [],
    preview: [],
    tick: 0,
  };
}

export function create1Controls(
  state,
  getActiveGameCtrl,
) {
  const invoke = (prop: string) => {
    state.history.push({
      tick: state.tick,
      control: prop,
    });
    getActiveGameCtrl()[prop]();
  };

  return Object.create(null, {
    moveDown: {
      configurable: false,
      value: partial(invoke, 'moveDown'),
    },
    moveLeft: {
      configurable: false,
      value: partial(invoke, 'moveLeft'),
    },
    moveRight: {
      configurable: false,
      value: partial(invoke, 'moveRight'),
    },
    moveUp: {
      configurable: false,
      value: partial(invoke, 'moveUp'),
    },
    rotateLeft: {
      configurable: false,
      value: partial(invoke, 'rotateLeft'),
    },
    rotateRight: {
      configurable: false,
      value: partial(invoke, 'rotateRight'),
    },
  });
}

function manageNewGame(conf, state, emit, nextBlock, gameOver) {
  const detectAndClear = functionsDetectClear.get(conf.detectAndClear);
  const game = createGame1(
    conf, 
    emit, 
    state.buffer,
    state.board,
    detectAndClear,
    nextBlock, 
    gameOver,
  );
  state.games.unshift(game);
  /** This is grossly stateful, sorry */
  let isPaused = false;
  let then: number = performance.now();
  let delta: number = 0;
  let isEnded = false;
  loop();

  return Object.create(null, {
    endGame: {
      configurable: false,
      value: () => {
        isEnded = true;
        game.controls.endGame();
      },
    },
    isPaused: {
      configurable: false,
      get: () => false,
      set: (value: boolean) => {
        // ignore pausing a paused game
        if (isPaused && value) {
          return;
        }
        // ignore unpausing an unpaused game
        if (!isPaused && !value) {
          return;
        }
        if (isPaused && !value) {
          isPaused = false;
          then = performance.now() - delta;
          loop();
          return;
        }
        isPaused = true;
      },
    },
    moveDown: {
      configurable: false,
      value: game.controls.moveDown,
    },
    moveLeft: {
      configurable: false,
      value: game.controls.moveLeft,
    },
    moveRight: {
      configurable: false,
      value: game.controls.moveRight,
    },
    moveUp: {
      configurable: false,
      value: game.controls.moveUp,
    },
    rotateLeft: {
      configurable: false,
      value: game.controls.rotateLeft,
    },
    rotateRight: {
      configurable: false,
      value: game.controls.rotateRight,
    },
  });

  function loop() {
    if (isEnded) { return; }
    requestAnimationFrame((now) => {
      if (isPaused) {
        loop();
        return;
      }
      delta = now - then;
      const didTick = game.tick(delta);
      if (didTick) {
        state.tick += 1;
        then = now;
      }
      loop();
    });
  }
}

/*
 * Creates an Engine.  Engines are responsible for holding onto
 * the random seed and orchestrating games
 */
export function create1(optionsConfig: GameConfig = {}) {
  const obj = Object.create(null);
  const conf = deepFreeze(forceValidateConfig(DEFAULT_CONFIG_1, optionsConfig));
  const state = create1state(conf);
  const events = createEventEmitter();
  const nextBlock = createNextBlock(conf, state.preview);
  let activeGameControl = manageNewGame(
    conf, state, events.emit, nextBlock, gameOver
  );

  function newGame() {
    if (!activeGameControl) {
      activeGameControl = manageNewGame(
        conf, state, events.emit, nextBlock, gameOver
      );
    }
  }

  function gameOver() {
    const { board } = state.games[0];
    state.history.push({
      tick: state.tick,
      control: 'gameOver',
    });
    board.desc.forEach((el, i) => {
      board.desc[i] = 0;
      state.buffer[i] = 0;
    });
    events.emit('game-over');
    newGame();
  }

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
      value: create1Controls(state, () => activeGameControl),
    },
    endGame: {
      configurable: false,
      value: () => {
        activeGameControl.endGame();
        activeGameControl = undefined;
      },
    },
    level: {
      configurable: false,
      get: () => state.games[0].state.level,
      set: noop,
    },
    on: {
      configurable: false,
      value: events.on,
    },
    pause: {
      configurable: false,
      value: () => {
        activeGameControl.isPaused = true;
        return () => {
          activeGameControl.isPaused = false;
        };
      },
    },
    preview: {
      configurable: false,
      value: state.preview,
    },
    score: {
      configurable: false,
      get: () => state.games[0].state.score,
      set: noop,
    },
    startGame: {
      configurable: false,
      value: newGame,
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
