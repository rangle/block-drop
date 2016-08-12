import {
  functionsDetectClear,
} from '../../engine/board';

import {
  GameConfig,
} from '../../interfaces';

import {
  deepFreeze,
} from '../../util';

import * as aTypes from '../actions/action-types';


/**
 *  0 <= boardLandscapeLimits <= 1
 *  0 <= boardPortraitLimits <= 1
 */
export interface IGameState {
  boardLandscapeLimits: { x: number, y: number };
  boardPortraitLimits: { x: number, y: number };
  config: GameConfig;
  currentGameViewportDimensions: {
    x: number, y: number, direction: 'row' | 'column'
  };
  lastEvent: { keyCode: number };
  trimCols: number;
  trimRows: number;
}

const INIT: IGameState = deepFreeze({
  boardLandscapeLimits: { x: 0.25, y: 0 },
  boardPortraitLimits: { x: 0, y: 0.25 },
  config: {
    debug: true,
    detectAndClear: 0,
    preview: 3,
  },
  currentGameViewportDimensions: { x: 0, y: 0, direction: 'row' },
  lastEvent: { keyCode: 0 },
  trimCols: 2,
  trimRows: 0,
});

export function game(state = INIT, action) {
  switch (action.type) {
    case aTypes.EVENT_KEYPRESS:
      return Object.assign({}, state, {
        lastEvent: action.payload,
      });
    case aTypes.CHANGE_GAME_CONFIG:
      const updated = {};
      updated[action.meta] = action.payload;
      return Object.assign({}, state, {
        config: Object.assign({}, state.config, updated),
      });

    case aTypes.EVENT_RESIZE:
      return Object.assign({}, state, {
        currentGameViewportDimensions: action.payload,
      });

    default:
      return state;
  }
}
