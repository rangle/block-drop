import { CHANGE_GAME_TYPE } from './action-types';

export function changeGameType(type: number) {
  return {
    type: CHANGE_GAME_TYPE,
    payload: type,
  };
}
