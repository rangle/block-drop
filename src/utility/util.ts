import { Board1, BooleanFunction, TypedArray } from '../interfaces';

export const aspectRatio = (width: number, height: number) =>
  divide(width, height);

export function boardToArray(b: any, width: number) {
  return Array.from(b.slice(width * 2));
}

export function recomputeBoard(buffer: any, width: number) {
  const newBoard: number[] = [];
  const board = boardToArray(buffer, width);

  let rows: any;

  board.forEach((el, i) => {
    if (i % width === 0) {
      rows = [];
    }
    rows.push(el);
    if (rows.length === width) {
      newBoard.push(rows);
    }
  });

  return newBoard;
}

export function camelToKebab(string: string) {
  return string.replace(/([A-Z])/g, s => '-' + s.toLowerCase());
}

export function kebabToCamel(string: string) {
  return string.replace(/(\-[a-z])/g, s => s.toUpperCase().replace('-', ''));
}

export function clamp(
  this: any,
  val: number,
  min: number = NaN,
  max: number = NaN
): number {
  if (min === min) {
    if (val < min) {
      val = min;
    }
  }

  if (max === max) {
    if (val > this.max) {
      val = this.max;
    }
  }

  return val;
}

/**
 * Creates percentage based sizes to optimally fit ix/iy in ox,oy
 *
 * ix === inner x, iy === inner y
 * ox === outer x, oy === outer y
 *
 * @example
 * // Example 1:
 *
 * // Viewport is 15x10
 * const ox = 15, oy = 10;
 *
 * // Inner Viewport with aspect ratio requirements is 20x10
 * const ix = 20, iy = 10;
 *
 * // remainder percentages for both x/y are zero (0)
 *
 * const result1 = computeAspectRatioDimensions(ox, oy, ix, iy);
 *
 * console.log(result1.x); // 15
 * console.log(result1.y); // 7.5
 *
 **/
export function computeAspectRatioDimensions(
  ox: number,
  oy: number,
  ix: number,
  iy: number
): { x: number; y: number } {
  const result = { x: 0, y: 0 };

  const oar = aspectRatio(ox, oy); // outer aspect ratio
  const ar = aspectRatio(ix, iy); // desired aspect ratio

  if (ar > oar) {
    result.x = ox;
    result.y = divide(ox, ar);
  } else {
    result.x = oy * ar;
    result.y = oy;
  }

  return result;
}

export function copyBuffer(from: any, to: any) {
  from.forEach((_: any, i: number) => (to[i] = from[i]));
}

/**
 * Debounces a function by delay.  Last call's parameters win
 */
export function debounce<T extends (...args: any[]) => any>(
  delay: number,
  fn: T
) {
  let timer: any = null;

  return ((...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
      // reset the timer
      timer = null;
    }, delay);
  }) as T;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    return 0;
  }
  return a / b;
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
  if (!board) {
    return false;
  }
  return board.descBuffer instanceof Uint8Array;
}

/**
 * merges a new value into an object property returning a new object
 */
export function mergeProp(obj: any, newValue: any, prop: string) {
  const newObj: any = {};
  newObj[prop] = newValue;
  return Object.assign({}, obj, newObj);
}

export function numberFromString(string: string): number {
  const mostlyNumeric = string.replace(/[^\d.-]/g, '');

  const firstDecimal = mostlyNumeric.indexOf('.');
  if (firstDecimal === -1) {
    return parseFloat(mostlyNumeric);
  }

  const lastDecimal = mostlyNumeric.lastIndexOf('.');
  if (lastDecimal === firstDecimal) {
    return parseFloat(mostlyNumeric);
  }

  return parseFloat(
    mostlyNumeric
      .split('.')
      .filter(Boolean)
      .slice(0, 2)
      .join('.')
  );
}

export function throwOutOfBounds(
  buffer: any[] | TypedArray,
  offset: number,
  message: string = ''
) {
  if (offset < 0) {
    throw new RangeError(`${message} out of bounds < 0`);
  }
  if (offset >= buffer.length) {
    throw new RangeError(`${message} out of bounds > length`);
  }
}

/**
 * throttles a given function so it only fires in "throttled" intervals
 *
 * last call prior to the interval "wins" with respect to passed arguments
 *
 * can optionally invokeImmediately
 */
export function throttle<T extends () => void>(
  delay: number,
  fn: Function,
  invokeImmediate: boolean = false
) {
  let timer: any = null;
  let lastArgs: any[];
  let isFirst = true;

  return ((...args) => {
    lastArgs = args;
    if (timer) {
      return;
    }

    if (invokeImmediate && isFirst) {
      fn(...lastArgs);
      isFirst = false;
    }

    timer = setTimeout(() => {
      if (!invokeImmediate) {
        fn(...lastArgs);
        timer = null;
        return;
      }
      // reset isFirst state
      isFirst = true;
      timer = null;
    }, delay);
  }) as T;
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
