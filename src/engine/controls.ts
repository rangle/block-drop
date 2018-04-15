import { GameControls } from '../interfaces';

export function createPollGamePad(controls: GameControls, interval: number) {
  let then = performance.now();
  let delta = then;
  return (time: number) => {
    delta = time - then;
    if (delta < interval) {
      return;
    }
    then = time;
    if (!window || !window.navigator || !window.navigator.getGamepads) {
      return;
    }
    const pads = window.navigator.getGamepads();
    if (!pads) {
      return;
    }
    // listen to all the gamepads (MVP)
    Array.prototype.forEach.call(pads, (pad: Gamepad) => {
      if (!pad) {
        // yes pad can be null in Chrome!
        return;
      }
      if (!pad.buttons || pad.buttons.length < 4) {
        return;
      }
      if (!pad.axes || pad.axes.length < 2) {
        return;
      }
      // start actual control logic
      if (pad.axes[0] < -0.2) {
        controls.moveLeft();
      }
      if (pad.axes[0] > 0.2) {
        controls.moveRight();
      }
      if (pad.axes[1] < -0.2) {
        controls.moveUp();
      }
      if (pad.axes[1] > 0.2) {
        controls.moveDown();
      }
      if (pad.buttons[2].pressed) {
        controls.rotateLeft();
      }
      if (pad.buttons[0].pressed) {
        controls.rotateRight();
      }
    });
  };
}
