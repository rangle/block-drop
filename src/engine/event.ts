/**
 * Events and Event emitter
 */
import {
  safeCall,
} from './util';

export function emitFrom(dict, message, ...args) {
  if (!dict[message]) {
    return;
  }
  Object.keys(dict[message])
    .forEach((prop) => safeCall(dict[message][prop], args));
}

export function onTo(dict, message, listener) {
  if (!dict[message]) {
    dict[message] = Object.create(null);
  }
  const id = Date.now() + Math.random();
  dict[message][id] = listener;

  return () => {
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
      value: emitFrom.bind(null, dict),
    },
    on: {
      writable: false,
      configurable: false,
      value: onTo.bind(null, dict),
    },
  });
}
