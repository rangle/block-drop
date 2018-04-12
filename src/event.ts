/**
 * Events and Event emitter
 */
import { partial, safeCall } from './util';

export function emitFrom(dict: Object, message: string, ...args: any[]) {
  if (!dict[message]) {
    return;
  }
  Object.keys(dict[message]).forEach(prop =>
    safeCall(dict[message][prop], args),
  );
}

export function onTo(dict: Object, message: string, listener: Function) {
  if (!dict[message]) {
    dict[message] = Object.create(null);
  }
  const id = Date.now() + Math.random();
  dict[message][id] = listener;

  return () => {
    if (!dict[message]) {
      return;
    }
    if (!dict[message][id]) {
      return;
    }
    delete dict[message][id];
    if (Object.keys(dict[message]).length === 0) {
      delete dict[message];
    }
  };
}

export function createEventEmitter() {
  const dict = Object.create(null);

  return Object.create(null, {
    emit: {
      writable: false,
      configurable: false,
      value: partial<(message: string, ...args: any[]) => void>(emitFrom, dict),
    },
    on: {
      writable: false,
      configurable: false,
      value: partial<(message: string, listener: Function) => () => void>(
        onTo,
        dict,
      ),
    },
  });
}
