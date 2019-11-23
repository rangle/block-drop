import { Dictionary, noop, objEach } from '@ch1/utility';

function isKeyboardEvent(thing: any): thing is KeyboardEvent {
  return thing instanceof KeyboardEvent;
}

export class KeyboardControl {
  static create(config: Dictionary<(keypress: KeyboardEvent) => void>) {
    return new KeyboardControl(config);
  }
  release: () => void = noop;

  constructor(private config: Dictionary<(keypress: KeyboardEvent) => void>) {}

  bind() {
    this.release();

    const handler = (keypress: Event | KeyboardEvent) =>
      isKeyboardEvent(keypress)
        ? objEach(this.config, (handler, key) =>
            keypress.keyCode + '' === key ? handler(keypress) : undefined
          )
        : undefined;

    window.addEventListener('keypress', handler);

    this.release = () => {
      window.removeEventListener('keypress', handler);
      this.release = noop;
    };
  }
}
