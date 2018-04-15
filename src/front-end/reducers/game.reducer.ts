import { Block, TypedArray } from '../../interfaces';

import { GameConfigOptions } from '../../interfaces';

import { deepFreeze } from '../../util';

import { DEFAULT_CONFIG_1 } from '../../engine/configs/default-config';

import {
  EVENT_KEYPRESS,
  EVENT_RESIZE,
  PAUSE,
  REPLACE_CONFIG,
  RESUME,
  UPDATE_ACTIVE_PIECE,
  UPDATE_PREVIEW,
  UPDATE_BUFFER,
  UPDATE_LEVEL,
  UPDATE_SCORE,
  UPDATE_LEVEL_PROGRESS,
  UPDATE_GAME_STATUS,
  UPDATE_SCORE_DATA,
} from '../constants';
import { O_EMPTY_BLOCK } from '../constants';
import { mergeProp, partial } from '../../util';

/**
 *  0 <= boardLandscapeLimits <= 1
 *  0 <= boardPortraitLimits <= 1
 *  config is the *active* config for the config.container see nextConfig
 */
export interface IGameState {
  activePiece: Block;
  buffer: Uint8Array;
  config: GameConfigOptions;
  currentGameViewportDimensions: {
    x: number;
    y: number;
    direction: 'row' | 'column';
  };
  firstAnimationBlock: number;
  isPaused: boolean;
  isStopped: boolean;
  lastEvent: { keyCode: number };
  level: number;
  levelProgress: number;
  preview: Block[];
  score: number;
  scoreAnimationDelay: number;
  lastAnimationBlock: number;
  lastLevelScore: number;
  lastClearScore: number;
  lastScoreUpdate: number;
  lastFwBonus: number;
  lastOverflowBonus: number;
  trimCols: number;
  trimRows: number;
}

const INIT: IGameState = deepFreeze({
  activePiece: O_EMPTY_BLOCK,
  buffer: new Uint8Array(0),
  config: Object.assign({}, DEFAULT_CONFIG_1, {
    debug: true,
  }),
  currentGameViewportDimensions: { x: 0, y: 0, direction: 'row' as 'row' },
  firstAnimationBlock: -1,
  isPaused: false,
  isStopped: false,
  lastAnimationBlock: -1,
  lastEvent: { keyCode: 0 },
  lastLevelScore: 0,
  lastClearScore: 0,
  lastScoreUpdate: 0,
  lastFwBonus: 0,
  lastOverflowBonus: 0,
  level: 0,
  levelProgress: 0,
  preview: [],
  score: 0,
  scoreAnimationDelay: 2000,
  trimCols: 2,
  trimRows: 0,
});

function getIndex(buffer: TypedArray, type: 'indexOf' | 'lastIndexOf') {
  let index = buffer[type](11);
  if (index < 0) {
    index = buffer[type](21);
    if (index < 0) {
      index = buffer[type](31);
    }
  }
  return index;
}

function getAnimationBlocks(buffer: TypedArray) {
  const indexStart = getIndex(buffer, 'indexOf');
  if (indexStart < 0) {
    return {
      firstAnimationBlock: -1,
      lastAnimationBlock: -1,
    };
  }
  const indexEnd = getIndex(buffer, 'lastIndexOf');
  return {
    firstAnimationBlock: indexStart,
    lastAnimationBlock: indexEnd,
  };
}

export function game(state = INIT, { payload, type }) {
  const bMergeProp: (prop: string) => any = partial(mergeProp, state, payload);

  switch (type) {
    case EVENT_KEYPRESS:
      return bMergeProp('lastEvent');

    case REPLACE_CONFIG:
      return bMergeProp('config');

    case EVENT_RESIZE:
      return bMergeProp('currentGameViewportDimensions');

    case PAUSE:
      return bMergeProp('isPaused');

    case RESUME:
      return bMergeProp('isPaused');

    case UPDATE_ACTIVE_PIECE:
      return bMergeProp('activePiece');

    case UPDATE_BUFFER:
      return {
        ...bMergeProp('buffer'),
        ...getAnimationBlocks(payload),
      };

    case UPDATE_PREVIEW:
      return bMergeProp('preview');

    case UPDATE_SCORE:
      return bMergeProp('score');

    case UPDATE_LEVEL:
      return bMergeProp('level');

    case UPDATE_LEVEL_PROGRESS:
      return bMergeProp('levelProgress');

    case UPDATE_GAME_STATUS:
      return bMergeProp('isStopped');

    case UPDATE_SCORE_DATA:
      return {
        ...state,
        lastLevelScore: payload.levelScore || 0,
        lastClearScore: payload.clearScore || 0,
        lastOverflowBonus: payload.overflowBonus || 0,
        lastFwBonus: payload.fwBonus || 0,
        lastFwBonusFw: payload.fw || 0,
        lastScoreUpdate: Date.now(),
      };

    default:
      return state;
  }
}
