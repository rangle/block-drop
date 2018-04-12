export interface Keymap {
  [keyCode: number]: Function;
}

export function registerKeyControls(
  keymap: Keymap,
  dispatch: (
    event: {
      keyCode: number;
    },
  ) => any,
) {
  function listener(e) {
    if (keymap[e.keyCode]) {
      keymap[e.keyCode]();
      dispatch({ keyCode: e.keyCode });
    }
  }

  window.addEventListener('keydown', listener);

  return () => window.removeEventListener('keydown', listener);
}
