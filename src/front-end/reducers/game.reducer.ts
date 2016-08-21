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

import * as aTypes from '../constants';
import { O_EMPTY_BLOCK } from '../constants';


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
  lastEvent: { keyCode: number };
  preview: Block[];
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
  lastEvent: { keyCode: 0 },
  preview: [],
  trimCols: 2,
  trimRows: 0,
});

export function game(state = INIT, action) {

  switch (action.type) {
    case aTypes.EVENT_KEYPRESS:
      return Object.assign({}, state, {
        lastEvent: action.payload,
      });

    case aTypes.CHANGE_CONFIG:
      return Object.assign({}, state, { config: action.payload });

    case aTypes.EVENT_RESIZE:
      return Object.assign({}, state, {
        currentGameViewportDimensions: action.payload,
      });

    case aTypes.UPDATE_ACTIVE_PIECE:
      return Object.assign({}, state, {
        activePiece: action.payload,
      });

    case aTypes.UPDATE_BUFFER:
      return Object.assign({}, state, {
        buffer: action.payload,
      });

    case aTypes.UPDATE_PREVIEW:
      return Object.assign({}, state, {
        preview: action.payload,
      });

    default:
      return state;
  }
}
