import {
  Board1, 
  BooleanFunction,
  TypedArray,
} from './interfaces';

export function boardToArray(b, width) {
  return Array.from(b.slice(width * 2));
}

export function copyBuffer(from, to) {
  from.forEach((el, i) => to[i] = from[i]);
}
/**
 * Links `state` such that it is a reference to a read only API 
 * 
 * read only in this case is a non-configurable getter/setter where the 
 * setter is noop. Props that are Objects are run against `createReadOnlyApiTo` 
 * and * are non-configurable.  Arrays are *copied* and their contents are run 
 * against `createReadOnlyApiTo`
 * 
 * **NOTE** this kind of an API, especially the nested objects will have 
 * performance penalties if getters are called repeatedly.  Also it's important
 * to be wary about Array references as they will "stale"
 * 
 * **NOTE 2** this function ignores methods 
 */
export function createReadOnlyApiTo(state: Object) {
  if (!isObject(state)) {
    throw new TypeError('createStats requires a state Object, given: ' + state);
  }
  const stats = Object.create(null);

  /* tslint:disable for-in we want prototypes */
  for (let i in state) {
    if (isObject(state[i])) {
      if (Array.isArray(state[i])) {
        Object.defineProperty(stats, i, {
          configurable: false,
          get: () => state[i].map((el, j) => isObject(el) ?
            createReadOnlyApiTo(state[i][j]) :
            state[i][j]),
          set: noop,
        });
      } else {
        Object.defineProperty(stats, i, {
          configurable: false,
          get: () => isObject(state[i]) ? createReadOnlyApiTo(state[i]) : 
            state[i],
          set: noop,
        }); 
      }
    } else {
      if (typeof state[i] === 'function') {
        // ignore functions (no smuggling :)) 
      } else {
        Object.defineProperty(stats, i, {
          configurable: false,
          get: () => state[i],
          set: noop,
        });
      }
    }
  }

  return stats;
}

/**
 * Utility functions
 */
export function deepFreeze(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(deepFreeze);
  } else if (isObject(obj)) {
    for (let i in obj) {
      if (isObject(obj[i])) {
        if (!Object.isFrozen(obj[i])) {
          obj[i] = deepFreeze(obj[i]);
        }
      }
    }
  }
  
  return Object.freeze(obj);
}

/**
 * Calculates the zero inclusive "middle" integer using a ceiling strategy
 */
export function intMidCeil(int: number): number {
  const newInt = int % 2 === 0 ? int / 2 : Math.floor(int / 2);
  return newInt;
}

/**
 * Calculates the zero inclusive "middle" integer using a floor strategy
 */
export function intMidFloor(int: number): number {
  const newInt = int % 2 === 0 ? int / 2 - 1 : Math.floor(int / 2);
  return newInt;
}

export function invertBoolean(fnBool: BooleanFunction): BooleanFunction {
  return (...args) => !fnBool(...args);
}

export function isBoard1(board: any): board is Board1 {
  if (!board) { return false; }
  return board.descBuffer instanceof Uint8Array;
}

/**
 * Is the given value a truthy object?
 */
export function isObject(obj: any): boolean {
  if (!obj) {
    return false;
  }

  return typeof obj === 'object';
}

/**
 * Sometimes a no operation is useful
 */
export function noop() {
}

/**
 * simple partial applicator.  faster than native .bind by some reports:
 * http://stackoverflow.com/questions/17638305/why-is-bind-slower-than-a-closure
 */
export function partial<T>(f: Function, ...args) {
  return <T>(...extra) => f.apply(null, [...args, ...extra])
}

export function pipe<T extends (arg: A) => R, A, R>(...args: Function[]) {
  if (args.length === 0) {
    throw new TypeError('pipe requires at least one argument');
  }
  if (args.length === 1) {
    return <T>args[0];
  }
  const first = args.shift();
  
  return <T>(...nextArgs) => args
    .reduce((state, next) => next(state), first.apply(null, nextArgs)); 
}

/**
 * Safe calls a functionn with args, *swallows errors*
 */
export function safeCall(fn: Function, args?: any[]) {
  try {
    fn.apply(null, args);
  } catch (e) {
    // fail over
  }
}

export function throwOutOfBounds(buffer: any[] | TypedArray,
                                 offset: number,
                                 message: string = '') {
  if (offset < 0) {
    throw new RangeError(`${message} out of bounds < 0`)
  }
  if (offset >= buffer.length) {
    throw new RangeError(`${message} out of bounds > length`)
  }
}
