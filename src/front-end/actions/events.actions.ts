import { KEYPRESS } from './action-types';

export function keyPress(event: { keyCode: number }) {
  return {
    type: KEYPRESS,
    payload: event,
  };
}
