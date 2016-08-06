import { CHANGE_GAME_CONFIG } from './action-types';

export function changeConfig(prop: string, value: number | string) {
  return {
    type: CHANGE_GAME_CONFIG,
    payload: value,
    meta: prop,
  };
}
