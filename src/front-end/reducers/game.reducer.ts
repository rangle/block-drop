export interface IGameState {
  gameType: number;
  gameTypes: string[];
  lastEvent: { keyCode: number };
}

import {
  deepFreeze,
} from '../../util';

import * as aTypes from '../actions/action-types';

const INIT: IGameState = deepFreeze({
  gameType: 0,
  gameTypes: ['Row Clear', 'Match Clear'],
  lastEvent: { keyCode: 0 },
});

export function game(state = INIT, action) {
  switch (action.type) {
    case aTypes.KEYPRESS:
      return Object.assign({}, state, {
        lastEvent: action.payload,
      });
    case aTypes.CHANGE_GAME_TYPE:
      return Object.assign({},state, {
        gameType: action.payload
      });
    default:
      return state;
  }
}
