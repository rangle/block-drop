import { EVENT_KEYPRESS, EVENT_RESIZE } from './action-types';

export function keyPress(event: { keyCode: number }) {
  return {
    type: EVENT_KEYPRESS,
    payload: event,
  };
}

export function resize(event: { x: number, y: number }) {
  return {
    type: EVENT_RESIZE,
    payload: event,
  };
}
