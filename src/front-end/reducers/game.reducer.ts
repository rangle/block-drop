import {
  Block,
} from '../../interfaces';

import {
  GameConfig,
} from '../../interfaces';

import {
  deepFreeze,
} from '../../util';

import {
  DEFAULT_CONFIG_1,
} from '../../engine/configs/default-config';

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
  config: GameConfig;
  currentGameViewportDimensions: {
    x: number, y: number, direction: 'row' | 'column'
  };
  isPaused: boolean;
  isStopped: boolean;
  lastEvent: { keyCode: number };
  level: number;
  levelProgress: number;
  preview: Block[];
  score: number;
  trimCols: number;
  trimRows: number;
}

const INIT: IGameState = deepFreeze({
  activePiece: O_EMPTY_BLOCK,
  buffer: new Uint8Array(0),
  config: Object.assign({}, DEFAULT_CONFIG_1, {
    debug: true,
  }),
  currentGameViewportDimensions: { x: 0, y: 0, direction: 'row' },
  isPaused: false,
  isStopped: false,
  lastEvent: { keyCode: 0 },
  level: 0,
  levelProgress: 0,
  preview: [],
  score: 0,
  trimCols: 2,
  trimRows: 0,
});

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
      return bMergeProp('buffer');

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

    default:
      return state;
  }
}
