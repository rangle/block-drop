/**
 * Events and Event emitter
 */
import { partial, Dictionary } from '@ch1/utility';
import { safeCall } from './util';

type Dict = Dictionary<Dictionary<Function>>;

export function emitFrom(dict: Dict, message: string, ...args: any[]) {
  if (!dict[message]) {
    return;
  }
  Object.keys(dict[message]).forEach(prop =>
    safeCall(dict[message][prop], args)
  );
}

export function onTo(
  dict: Dict,
  message: string,
  listener: (...args: any[]) => void
) {
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

export function createEventEmitter(): {
  emit: (message: string, ...args: any[]) => void;
  on: (message: string, callback: (...args: any[]) => void) => () => void;
} {
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
        dict
      ),
    },
  });
}
