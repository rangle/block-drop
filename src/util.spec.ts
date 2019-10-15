import {
  aspectRatio,
  camelToKebab,
  copyBuffer,
  computeAspectRatioDimensions,
  debounce,
  divide,
  kebabToCamel,
  intMidCeil,
  intMidFloor,
  invertBoolean,
  isBoard1,
  mergeProp,
  noop,
  numberFromString,
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
      }
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

  describe('safeCall function', () => {
    it('should resolve even if its function throws', () => {
      expect(() =>
        safeCall(() => {
          throw new Error();
        })
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
