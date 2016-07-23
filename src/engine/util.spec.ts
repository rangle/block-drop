import {
  deepFreeze,
  intMidCeil,
  intMidFloor,
  isBoard1,
  isObject,
  noop,
  safeCall,
} from './util';

describe('utility functions', () => {
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

      expect(() => frozen.a = 23).toThrowError();
      expect(() => frozen.b = 23).toThrowError();
    });

    it('should freeze object properties on an object', () => {
      const frozen = deepFreeze({
        a: 5,
        b: 'hello',
        c: {
          d: 'test',
        }
      });

      expect(() => frozen.c.d = 23).toThrowError();
    });

    it('should freeze nested arrays', () => {
      const frozen = deepFreeze([[ 1 ]]);

      expect(() => frozen[0][0] = 5).toThrowError();
      expect(() => frozen[0].push(5)).toThrowError();
    });
    
    it('should skip frozen sub-objects', () => {
      const frozen = deepFreeze({ test: Object.freeze({ nest: { val: 1 } })});
      expect(() => frozen.test.nest.val = 5).not.toThrowError();
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

  describe('noop function', () => {
    it('should do nothing', () => {
      expect(() => noop()).not.toThrowError();
    });
  });

  describe('safeCall function', () => {
    it('should resolve even if it\s function throws', () => {
      expect(() => safeCall(() => { throw new Error(); })).not.toThrowError();
    });

    it('should resolve normal cases', () => {
      expect(() => safeCall(noop)).not.toThrowError();
    });
  });
});
