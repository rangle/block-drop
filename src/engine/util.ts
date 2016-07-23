import {
  Board1, 
} from './interfaces';

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
 * Safe calls a functionn with args, *swallows errors*
 */
export function safeCall(fn: Function, args?: any[]) {
  try {
    fn.apply(null, args);
  } catch(e) {
    // fail over
  }
}
