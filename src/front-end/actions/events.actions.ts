import { EVENT_KEYPRESS, EVENT_RESIZE } from '../constants';

export function keyPress(event: { keyCode: number }) {
  return {
    type: EVENT_KEYPRESS,
    payload: event,
  };
}

export function viewportResize(event: { x: number; y: number }) {
  return {
    type: EVENT_RESIZE,
    payload: event,
  };
}
