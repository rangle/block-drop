import {
  aspectRatio,
  camelToKebab,
  copyBuffer,
  computeAspectRatioDimensions,
  createReadOnlyApiTo,
  debounce,
  divide,
  deepFreeze,
  kebabToCamel,
  intMidCeil,
  intMidFloor,
  invertBoolean,
  isBoard1,
  isObject,
  mergeProp,
  noop,
  numberFromString,
  partial,
  pluck,
  pipe,
  safeCall,
  throttle,
  throwOutOfBounds,
} from './util';

describe('utility functions', () => {
  describe('aspect ratio', () => {
    it('should divide width by height', () => {
      expect(aspectRatio(10, 5)).toBe(2);
    });
  });

  describe('computeAspectRatioDimensions function', () => {
    it('should return 7.5/10 outer if given 15/10 outer, 20/10 inner', () => {
      const result = computeAspectRatioDimensions(15, 10, 20, 10);
      expect(result.x).toBe(15);
      expect(result.y).toBe(7.5);
    });

    it('should return 6/10 outer if given 50/10 outer 15/25 inner', () => {
      const result = computeAspectRatioDimensions(50, 10, 15, 25);
      expect(result.x).toBe(6);
      expect(result.y).toBe(10);
    });
  });

  describe('debounce function', () => {
    it('should only call a function once, after a delay', done => {
      let result = 0;
      const inc = () => (result += 1);
      const debouncedInc = debounce<() => void>(0, inc);
      debouncedInc();
      debouncedInc();
      debouncedInc();
      setTimeout(() => {
        expect(result).toBe(1);
        done();
      });
    });

    it('the last call\'s arguments should "win"', done => {
      let result = 0;
      const addToResult = (val: number) => (result += val);
      const debouncedInc = debounce(0, addToResult);
      debouncedInc(1);
      debouncedInc(2);
      debouncedInc(3);
      setTimeout(() => {
        expect(result).toBe(3);
        done();
      });
    });

    it("should support multiple calls if they're adequately spaced", done => {
      let result = 0;
      const inc = () => (result += 1);
      const debouncedInc = debounce<() => void>(0, inc);
      debouncedInc();
      setTimeout(() => {
        expect(result).toBe(1);
        debouncedInc();
        setTimeout(() => {
          expect(result).toBe(2);
          done();
        }, 5);
      }, 5);
    });
  });

  describe('divide function', () => {
    it('should return zero on divide by zero', () => {
      expect(divide(5, 0)).toBe(0);
    });

    it('should divide', () => {
      expect(divide(10, 2)).toBe(5);
    });
  });

  describe('kebabToCamel function', () => {
    it('should do nothing to no dashes', () => {
      expect(kebabToCamel('test')).toBe('test');
    });

    it('should do a single dash', () => {
      expect(kebabToCamel('test-it')).toBe('testIt');
    });

    it('should do many dashes', () => {
      expect(kebabToCamel('test-it-real-good')).toBe('testItRealGood');
    });
  });

  describe('camelToKebab function', () => {
    it('should do nothing to no humps', () => {
      expect(kebabToCamel('test')).toBe('test');
    });

    it('should do a single hump', () => {
      expect(camelToKebab('testIt')).toBe('test-it');
    });

    it('should do many humps', () => {
      expect(camelToKebab('testItRealGood')).toBe('test-it-real-good');
    });
  });

  describe('copyBuffer function', () => {
    it('should overwrite the second argument', () => {
      const from = new Uint8Array([1, 2, 3]);
      const to = new Uint8Array([4, 5, 6]);
      copyBuffer(from, to);
      expect(Array.from(to)).toEqual([1, 2, 3]);
    });
  });

  describe('createReadOnlyApiTo function', () => {
    it('should throw if not given an Object', () => {
      expect(() => createReadOnlyApiTo(5)).toThrowError();
    });

    it('should create a read only API', () => {
      const readOnly = createReadOnlyApiTo({
        a: 5,
      });
      expect(readOnly.a).toBe(5);
      readOnly.a = 5;
      expect(readOnly.a).toBe(5);
    });

    it('should ignore methods', () => {
      const readOnly = createReadOnlyApiTo({
        a: noop,
      });
      expect(readOnly.a).toBeUndefined();
    });

    it('should update if the original object is changed', () => {
      const writable = {
        a: 5,
      };
      const readOnly = createReadOnlyApiTo(writable);
      expect(readOnly.a).toBe(5);
      writable.a = 7;
      expect(readOnly.a).toBe(7);
    });

    it('nested objects should also be read only', () => {
      const writable = {
        a: {
          b: 5,
        },
      };
      const readOnly = createReadOnlyApiTo(writable);
      readOnly.a.b = 7;
      expect(readOnly.a.b).toBe(5);
    });

    it('nested objects should not be configurable', () => {
      const writable = {
        a: {
          b: 5,
        },
      };
      const readOnly = createReadOnlyApiTo(writable);
      readOnly.a = 52;
      expect(readOnly.a.b).toBe(5);
    });

    it('nested objects should also update if their writable changes', () => {
      const writable = {
        a: {
          b: 5,
        },
      };
      const readOnly = createReadOnlyApiTo(writable);
      expect(readOnly.a.b).toBe(5);
      writable.a.b = 7;
      expect(readOnly.a.b).toBe(7);
    });

    it('nested arrays should also be read only', () => {
      const writable = {
        a: [5],
      };
      const readOnly = createReadOnlyApiTo(writable);
      readOnly.a[0] = 7;
      expect(readOnly.a[0]).toBe(5);
    });

    it('nested arrays should not be configurable', () => {
      const writable = {
        a: [5],
      };
      const readOnly = createReadOnlyApiTo(writable);
      readOnly.a = 52;
      expect(readOnly.a[0]).toBe(5);
    });

    it('nested arrays should also update if their writable changes', () => {
      const writable = {
        a: [5],
      };
      const readOnly = createReadOnlyApiTo(writable);
      expect(readOnly.a[0]).toBe(5);
      writable.a[0] = 7;
      expect(readOnly.a[0]).toBe(7);
    });
  });

  describe('deepFreeze function', () => {
    it('should return an identity if given a non-object', () => {
      expect(deepFreeze(null)).toBe(null);
      expect(deepFreeze('hello')).toBe('hello');
      expect(deepFreeze(7)).toBe(7);
    });

    it('should freeze properties on an object', () => {
      const frozen = deepFreeze({
        a: 5,
        b: 'hello',
      });

      expect(() => (frozen.a = 23)).toThrowError();
      expect(() => (frozen.b = '23')).toThrowError();
    });

    it('should freeze object properties on an object', () => {
      const frozen = deepFreeze({
        a: 5,
        b: 'hello',
        c: {
          d: 'test',
        },
      });

      expect(() => (frozen.c.d = '23')).toThrowError();
    });

    it('should freeze nested arrays', () => {
      const frozen = deepFreeze([[1]]);

      expect(() => (frozen[0][0] = 5)).toThrowError();
      expect(() => frozen[0].push(5)).toThrowError();
    });

    it('should skip frozen sub-objects', () => {
      const frozen = deepFreeze({ test: Object.freeze({ nest: { val: 1 } }) });
      expect(() => (frozen.test.nest.val = 5)).not.toThrowError();
    });
  });

  describe('intMidCeil', () => {
    it('should return 2 if given 5', () => {
      expect(intMidCeil(5)).toBe(2);
    });

    it('should return 2 if given 4', () => {
      expect(intMidCeil(4)).toBe(2);
    });
  });

  describe('intMidFloor', () => {
    it('should return 2 if given 5', () => {
      expect(intMidFloor(5)).toBe(2);
    });

    it('should return 1 if given 4', () => {
      expect(intMidFloor(4)).toBe(1);
    });
  });

  describe('invertBoolean function', () => {
    it('should return true instead of false', () => {
      expect(invertBoolean(() => false)()).toBe(true);
    });

    it('should return false instead of true', () => {
      expect(invertBoolean(() => true)()).toBe(false);
    });

    it('should take an argument', () => {
      expect(invertBoolean(arg => arg)(false)).toBe(true);
    });

    it('should take variadic argument', () => {
      expect(invertBoolean((_, __, c) => c)(null, null, true)).toBe(false);
    });
  });

  describe('isBoard1', () => {
    it('should return false if given a falsey', () => {
      expect(isBoard1(null)).toBe(false);
    });

    it('should return true if Board1 has a descBuffer', () => {
      expect(isBoard1({ descBuffer: new Uint8Array(1) })).toBe(true);
    });
  });

  describe('isObject function', () => {
    it('should return false if given nothing', () => {
      expect(isObject(undefined)).toBe(false);
    });

    it('should return false if given null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false if given a primitive', () => {
      expect(isObject(5)).toBe(false);
    });

    it('should return true if given an Array', () => {
      expect(isObject([])).toBe(true);
    });

    it('should return true if given an Object', () => {
      expect(isObject({})).toBe(true);
    });
  });

  describe('mergeProp', () => {
    it('should merge a property into an object', () => {
      const obj = {};
      const newObj: any = mergeProp(obj, 'me', 'test');
      expect(newObj.test).toBe('me');
    });

    it('should return a new object', () => {
      const obj = {};
      const newObj = mergeProp(obj, 'me', 'test');
      expect(newObj).not.toBe(obj);
    });

    it(
      'should return a new object that has the original properties other ' +
        'than the prop merged in',
      () => {
        const obj = { test2: 'word' };
        const newObj: any = mergeProp(obj, 'me', 'test');
        expect(newObj.test2).toBe('word');
      },
    );
  });

  describe('noop function', () => {
    it('should do nothing', () => {
      expect(() => noop()).not.toThrowError();
    });
  });

  describe('number from string', () => {
    it('should return simple strings', () => {
      expect(numberFromString('5')).toBe(5);
    });

    it('should handle simple decimals', () => {
      expect(numberFromString('.25')).toBe(0.25);
    });

    it('should handle silly decimals', () => {
      expect(numberFromString('11.11.12.13')).toBe(11.11);
    });

    it('should remove pretext', () => {
      expect(numberFromString('goto52.11')).toBe(52.11);
    });

    it('should remove posttext', () => {
      expect(numberFromString('11.22px')).toBe(11.22);
    });
  });

  describe('partial function', () => {
    function addThreeArgs(a: number, b: number, c: number): number {
      return a + b * c;
    }

    it('should work for a simple single argument', () => {
      expect(
        partial<(b: number, c: number) => number>(addThreeArgs, 3)(2, 3),
      ).toBe(9);
    });

    it('should work for two arguments', () => {
      expect(partial<(c: number) => number>(addThreeArgs, 3, 2)(3)).toBe(9);
    });

    it('should work for three arguments', () => {
      expect(partial<() => number>(addThreeArgs, 3, 2, 3)()).toBe(9);
    });
  });

  describe('pluck function', () => {
    it('should return a property from and object', () => {
      expect(pluck('value', { value: 5 })).toBe(5);
    });
  });

  describe('pipe function', () => {
    it('should return throw if given nothing', () => {
      expect(() => pipe()).toThrowError();
    });

    it('should return the identity if given one argument', () => {
      expect(pipe(pipe)).toBe(pipe);
    });

    it('should compose functions from left to right', () => {
      const add1 = i => i + 1;
      const times3 = i => i * 3;
      const addOneThenTimes3 = pipe<(val: number) => number, number, number>(
        add1,
        times3,
      );
      expect(addOneThenTimes3(5)).toBe(18);
    });
  });

  describe('safeCall function', () => {
    it('should resolve even if its function throws', () => {
      expect(() =>
        safeCall(() => {
          throw new Error();
        }),
      ).not.toThrowError();
    });

    it('should resolve normal cases', () => {
      expect(() => safeCall(noop)).not.toThrowError();
    });
  });

  describe('throttle function', () => {
    it('should run a function once after a predefined delay', done => {
      let result = 0;
      const throttled = throttle<() => void>(5, () => (result += 1));
      throttled();
      throttled();
      throttled();
      throttled();
      expect(result).toBe(0);
      setTimeout(() => {
        expect(result).toBe(1);
        done();
      }, 15);
    });

    it('should optionally run a function at the _start_ of a delay', done => {
      let result = 0;
      const throttled = throttle<() => void>(5, () => (result += 1), true);
      throttled();
      expect(result).toBe(1);
      setTimeout(() => {
        expect(result).toBe(1);
        done();
      }, 15);
    });

    it('should work multiple times', done => {
      let result = 0;
      const throttled = throttle<() => void>(5, () => (result += 1));
      throttled();
      expect(result).toBe(0);
      setTimeout(() => {
        expect(result).toBe(1);
        throttled();
        setTimeout(() => {
          expect(result).toBe(2);
          done();
        }, 15);
      }, 15);
    });
  });

  describe('throwOutOfBounds function', () => {
    it('should throw if offset is less than zero', () => {
      expect(() => throwOutOfBounds([], -1)).toThrowError();
    });

    it('should throw if offset is greater than or equal to length', () => {
      expect(() => throwOutOfBounds(['1'], 1)).toThrowError();
    });
  });
});
