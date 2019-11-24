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
import boardFunctions, { addBlock } from './board';

import blockFunctions from './block';

import { createPollGamePad } from './controls';

import { DEFAULT_CONFIG_1 } from './configs/default-config';

import { createEventEmitter } from '../utility/event';

import {
  Block,
  GameConfig,
  GameConfigOptions,
  NextBlockConfig,
  GameControls,
} from './interfaces';

import randomFunctions, { between, randomSet } from './random';

import rulesFunctions from './rules';

import { deepFreeze, noop, partial } from '@ch1/utility';
import { copyBuffer, throttle } from '../utility/util';

import { createGame1 } from './game';

export { configInterfaces } from './configs/config-interfaces';

export function create1state(conf: GameConfig) {
  const createBoard = boardFunctions.createBoard.get(conf.createBoard);
  const board = createBoard(conf.width, conf.height);
  const buffer = Uint8Array.from(board.desc);

  return {
    activePiece: null,
    activeFramework: conf.startingFramework,
    board,
    buffer,
    conf,
    game: undefined,
    history: [],
    pauses: [],
    preview: [],
    tick: 0,
  };
}

export function create1Controls(
  state: any,
  getActiveGameCtrl: any,
  emit: any,
  throttleInterval: number,
  enableShadow = false
) {
  const invoke = (prop: string) => {
    state.history.push({
      tick: state.tick,
      control: prop,
    });
    if (getActiveGameCtrl()[prop]()) {
      copyBuffer(state.board.desc, state.buffer);
      addBlock(
        state.board,
        state.game.state.activePiece,
        state.buffer,
        enableShadow
      );
      emit('redraw');
    }
  };

  return Object.create(null, {
    incrementFramework: {
      configurable: false,
      value: throttle(
        throttleInterval,
        () => {
          if (state.activeFramework === 10) {
            emit('fw-switch', 20);
          } else if (state.activeFramework === 20) {
            emit('fw-switch', 30);
          } else {
            emit('fw-switch', 10);
          }
        },
        true
      ),
    },
    decrementFramework: {
      configurable: false,
      value: throttle(
        throttleInterval,
        () => {
          if (state.activeFramework === 10) {
            emit('fw-switch', 30);
          } else if (state.activeFramework === 20) {
            emit('fw-switch', 10);
          } else {
            emit('fw-switch', 20);
          }
        },
        true
      ),
    },
    moveDown: {
      configurable: false,
      value: throttle(throttleInterval, partial(invoke, 'moveDown'), true),
    },
    moveLeft: {
      configurable: false,
      value: throttle(throttleInterval, partial(invoke, 'moveLeft'), true),
    },
    moveRight: {
      configurable: false,
      value: throttle(throttleInterval, partial(invoke, 'moveRight'), true),
    },
    moveUp: {
      configurable: false,
      value: throttle(throttleInterval, partial(invoke, 'moveUp'), true),
    },
    rotateLeft: {
      configurable: false,
      value: throttle(throttleInterval, partial(invoke, 'rotateLeft'), true),
    },
    rotateRight: {
      configurable: false,
      value: throttle(throttleInterval, partial(invoke, 'rotateRight'), true),
    },
    setFramework: {
      configurable: false,
      value: (val: 10 | 20 | 30) => {
        state.activeFramework = val;
      },
    },
  });
}

function manageNewGame(
  conf: GameConfig,
  controls: GameControls,
  state: any,
  emit: any,
  nextBlock: any,
  gameOver: any
) {
  const detectAndClear = boardFunctions.detectAndClear.get(conf.detectAndClear);
  state.game = createGame1(
    conf,
    emit,
    state.board,
    detectAndClear,
    nextBlock,
    gameOver,
    () => state.activeFramework
  );
  /** This is grossly stateful, sorry */
  let isPaused = false;
  let then: number = performance.now();
  let delta: number = 0;
  let isEnded = false;
  loop();
  const pollGamePad = createPollGamePad(controls, conf.gamePadPollInterval);

  return Object.create(null, {
    endGame: {
      configurable: false,
      value: () => {
        isEnded = true;
      },
    },
    isPaused: {
      configurable: false,
      get: () => isPaused,
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
      value: state.game.controls.moveDown,
    },
    moveLeft: {
      configurable: false,
      value: state.game.controls.moveLeft,
    },
    moveRight: {
      configurable: false,
      value: state.game.controls.moveRight,
    },
    moveUp: {
      configurable: false,
      value: state.game.controls.moveUp,
    },
    rotateLeft: {
      configurable: false,
      value: state.game.controls.rotateLeft,
    },
    rotateRight: {
      configurable: false,
      value: state.game.controls.rotateRight,
    },
  });

  function loopDidTick(now: number) {
    state.tick += 1;
    then = now;
    // stuff happened, flip it!
    copyBuffer(state.board.desc, state.buffer);
    addBlock(
      state.board,
      state.game.state.activePiece,
      state.buffer,
      conf.enableShadow
    );
    state.game.emit('redraw');
  }

  function loop() {
    if (isEnded) {
      return;
    }
    requestAnimationFrame(now => {
      pollGamePad(now, isPaused);
      if (isPaused) {
        loop();
        return;
      }
      delta = now - then;
      const didTick = state.game.tick(delta);
      if (didTick) {
        loopDidTick(now);
      }
      loop();
    });
  }
}

/*
 * Creates an Engine.  Engines are responsible for holding onto
 * the random seed and orchestrating games
 */
export function create1(optionsConfig: GameConfigOptions = {}) {
  const obj = Object.create(null);
  const conf = deepFreeze(forceValidateConfig(DEFAULT_CONFIG_1, optionsConfig));
  const state = create1state(conf);
  const events = createEventEmitter();
  const nextBlock = createNextBlock(conf, state.preview);
  let activeGameControl: any;
  const pause = () => {
    if (activeGameControl.isPaused) {
      activeGameControl.isPaused = false;
      events.emit('resume');
    } else {
      activeGameControl.isPaused = true;
      events.emit('pause');
    }
  };
  const controls = create1Controls(
    state,
    () => activeGameControl,
    events.emit,
    conf.gamePadThrottleInterval,
    conf.enableShadow
  );
  controls.pause = pause;
  activeGameControl = manageNewGame(
    conf,
    controls,
    state,
    events.emit,
    nextBlock,
    gameOver
  );

  function newGame() {
    if (!activeGameControl) {
      activeGameControl = manageNewGame(
        conf,
        controls,
        state,
        events.emit,
        nextBlock,
        gameOver
      );
    }
  }

  function gameOver(doRestart = false) {
    const { board } = state.game as any;
    (state.history as any).push({
      tick: state.tick,
      control: 'gameOver',
    });
    board.desc.forEach((_: any, i: number) => {
      board.desc[i] = 0;
      state.buffer[i] = 0;
    });
    obj.endGame();
    events.emit('game-over');

    if (doRestart) {
      obj.startGame();
    }
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
      value: controls,
    },
    endGame: {
      configurable: false,
      value: () => {
        activeGameControl.endGame();
        activeGameControl = undefined;
      },
    },
    isPaused: {
      configurable: false,
      get: () => (activeGameControl ? activeGameControl.isPaused : false),
      set: noop,
    },
    level: {
      configurable: false,
      get: () => (state.game as any).state.level,
      set: noop,
    },
    on: {
      configurable: false,
      value: events.on,
    },
    pause: {
      configurable: false,
      value: pause,
    },
    preview: {
      configurable: false,
      value: state.preview,
    },
    score: {
      configurable: false,
      get: () => (state.game as any).state.score,
      set: noop,
    },
    startGame: {
      configurable: false,
      value: newGame,
    },
  });
  return obj;
}

export function forceValidateConfig(
  defaults: GameConfigOptions,
  config: any = {}
): GameConfig {
  Object.keys(defaults).forEach(prop => {
    config[prop] =
      config[prop] === undefined ? (defaults as any)[prop] : config[prop];
  });

  config.seed = config.seed || Date.now();

  return config;
}

export function createNextBlock(
  c: NextBlockConfig,
  previewContainer: Block[] = []
) {
  const createBlock = blockFunctions.createBlock.get(c.createBlock);
  const blocks = c.blockDescriptions.map((el: any) =>
    createBlock(el.desc, 0, 0, el.name)
  );
  const rand = randomFunctions.get(c.seedRandom)(c.seed);
  const spawnF = rulesFunctions.spawns.get(c.spawn);
  const spawn: (block: Block) => Block = partial(spawnF, c.width, c.height);

  const randomBlock: () => Block =
    c.randomMethod === 'random'
      ? () => blocks[between(rand, blocks.length)]
      : randomSet(rand, blocks);

  if (c.preview <= 0) {
    return () => spawn(randomBlock());
  }

  const max = c.preview > blocks.length ? blocks.length : c.preview;

  for (let i = 0; i < max; i += 1) {
    previewContainer.push(randomBlock());
  }

  return () => {
    previewContainer.push(randomBlock());
    return spawn((previewContainer as any).shift());
  };
}
