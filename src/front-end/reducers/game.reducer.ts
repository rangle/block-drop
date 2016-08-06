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


export interface IGameState {
  config: GameConfig;
  lastEvent: { keyCode: number };
}

const INIT: IGameState = deepFreeze({
  config: {
    debug: true,
    detectAndClear: 0,
    next: 3,
  },
  lastEvent: { keyCode: 0 },
});

export function game(state = INIT, action) {
  switch (action.type) {
    case aTypes.KEYPRESS:
      return Object.assign({}, state, {
        lastEvent: action.payload,
      });
    case aTypes.CHANGE_GAME_CONFIG:
      const updated = {};
      updated[action.meta] = action.payload;
      return Object.assign({}, state, {
        config: Object.assign({}, state.config, updated),
      });
    default:
      return state;
  }
}
