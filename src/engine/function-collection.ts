import { FunctionsCollection } from '../interfaces';
import { isFunction, partial } from '../util';

export function getFunctionFrom(
  defaultFn,
  collection: Object,
  fnName?: string,
) {
  if (collection[fnName]) {
    return collection[fnName];
  }

  return defaultFn;
}

export function list(collection: Object): string[] {
  return Object.keys(collection);
}

export function makeCollection<T extends Function>(
  collection: Object,
  defaultFn: T,
): FunctionsCollection<T> {
  Object.keys(collection).forEach(prop =>
    Object.defineProperty(collection, prop, {
      configurable: false,
      writable: false,
      value: collection[prop],
    }),
  );

  return Object.create(null, {
    default: {
      configurable: false,
      writable: false,
      value: defaultFn,
    },
    get: {
      configurable: false,
      writable: false,
      value: partial<(name: string) => T>(
        getFunctionFrom,
        defaultFn,
        collection,
      ),
    },
    list: {
      configurable: false,
      writable: false,
      value: partial<() => string[]>(list, collection),
    },
    register: {
      configurable: false,
      writable: false,
      value: partial<(name: string, fn: T) => void>(registerTo, collection),
    },
  });
}

/**
 * Adds `func` to `collection` as `prop` *if* `prop` does *not* exist on
 * `collection`
 */
export function registerTo(
  collection: Object,
  prop: string,
  func: () => number,
) {
  if (!isFunction(func)) {
    throw new TypeError('registerTo requires a function');
  }

  if (!prop) {
    throw new TypeError('registerTo requires a prop');
  }

  if (typeof prop !== 'string') {
    throw new TypeError('registerTo requires prop to be a string');
  }

  if (collection[prop]) {
    return;
  }

  Object.defineProperty(collection, prop, {
    configurable: false,
    writable: false,
    value: func,
  });
}
