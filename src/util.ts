import { Board1, BooleanFunction, Dictionary, TypedArray } from './interfaces';

export const aspectRatio = (width: number, height: number) =>
  divide(width, height);

export function boardToArray(b, width) {
  return Array.from(b.slice(width * 2));
}

export function recomputeBoard(buffer, width) {
  const newBoard = [];
  const board = boardToArray(buffer, width);

  let rows;

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
  val: number,
  min: number = NaN,
  max: number = NaN,
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
  iy: number,
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

export function copyBuffer(from, to) {
  from.forEach((_, i) => (to[i] = from[i]));
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
          get: () =>
            state[i].map(
              (el, j) =>
                isObject(el) ? createReadOnlyApiTo(state[i][j]) : state[i][j],
            ),
          set: noop,
        });
      } else {
        Object.defineProperty(stats, i, {
          configurable: false,
          get: () =>
            isObject(state[i]) ? createReadOnlyApiTo(state[i]) : state[i],
          set: noop,
        });
      }
    } else {
      if (isFunction(state[i])) {
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
 * Debounces a function by delay.  Last call's parameters win
 */
export function debounce<T extends (...args: any[]) => any>(
  delay: number,
  fn: T,
) {
  let timer = null;

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

export function identity(value) {
  return value;
}

export function deepCall(map, obj) {
  if (Array.isArray(obj)) {
    return map(obj.map(partial(deepCall, map)));
  }

  if (isObject(obj)) {
    for (let i in obj) {
      if (isObject(obj[i])) {
        if (!Object.isFrozen(obj[i])) {
          obj[i] = (partial(deepCall, map) as any)(obj[i]);
        }
      }
    }
  }

  return map(obj);
}

export const deepFreeze: <T>(o: T) => T = partial(
  deepCall,
  Object.freeze.bind(Object),
);

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

export function isFunction(fn: any): fn is Function {
  return typeof fn === 'function';
}

export function isNumber(val: any): val is number {
  return typeof val === 'number';
}

/**
 * Is the given value a truthy object?
 */
export function isObject(obj: any): obj is Object {
  if (!obj) {
    return false;
  }

  return typeof obj === 'object';
}

export function isString(val: any): val is string {
  return typeof val === 'string';
}

/**
 * merges a new value into an object property returning a new object
 */
export function mergeProp(obj: Object, newValue, prop: string) {
  const newObj = {};
  newObj[prop] = newValue;
  return Object.assign({}, obj, newObj);
}

/**
 * Sometimes a no operation is useful
 */
export function noop() {}

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
      .join('.'),
  );
}

/**
 * simple .bind wrapper */
export function partial<T>(f: Function, ...args) {
  return f.bind(this, ...args) as T;
}

export function pluck<T>(prop: string, dict: Dictionary<T>) {
  return dict[prop];
}

export function pipe<T extends (arg: A) => R, A, R>(...args: Function[]) {
  if (args.length === 0) {
    throw new TypeError('pipe requires at least one argument');
  }
  if (args.length === 1) {
    return <T>args[0];
  }
  const first = args.shift();

  return ((...nextArgs) =>
    args.reduce(
      (state, next) => next(state),
      first.apply(null, nextArgs),
    )) as T;
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
  invokeImmediate: boolean = false,
) {
  let timer = null;
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

export function throwOutOfBounds(
  buffer: any[] | TypedArray,
  offset: number,
  message: string = '',
) {
  if (offset < 0) {
    throw new RangeError(`${message} out of bounds < 0`);
  }
  if (offset >= buffer.length) {
    throw new RangeError(`${message} out of bounds > length`);
  }
}
