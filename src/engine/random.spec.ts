import {
  between,
  getRandomFunctionFrom,
  randomSet,
  registerRandomTo,
  shuffle,
} from './random';

import {
  noop,
} from '../util';

const seedRandom = require('seedrandom');

describe('random number functions', () => {
  describe('between function', () => {
    it('should throw if minimum is less than maximum', () => {
      expect(() => between(<() => number>noop, 10, 11)).toThrowError();
    });

    it('should return min if given a random value close to zero', () => {
      expect(between(() => 0.01, 10, 2)).toBe(2);
    });

    it('should return zero if given a random value close to zero and no min',
      () => {
        expect(between(() => 0.01, 10)).toBe(0);
      });

    it('should return max number - 1 if given a random value close to one',
      () => {
        expect(between(() => 0.999, 10)).toBe(9);
      });
  });

  describe('getRandomFunctionFrom', () => {
    it('should return a function if it exists on collection', () => {
      const collection = { test: noop };
      expect(getRandomFunctionFrom(collection, 'test')).toBe(noop);
    });
    
    it('should return the default random function if requested function does ' +
      'not exist', () => {
      expect(getRandomFunctionFrom({})).toEqual(seedRandom.xor4096);
    });
  });

  describe('randomSet function', () => {
    it('should provide a function that returns a random element from a set',
      () => {
        const givenSet = [1, 2, 3, 4, 5];
        const fn = randomSet<number>(() => 0.01, givenSet);
        expect(fn()).toBe(2);
      });

    it('should re-shuffle when a set is exhausted', () => {
      const givenSet = [1, 2, 3, 4, 5];
      const fn = randomSet<number>(() => 0.01, givenSet);
      givenSet.forEach(fn);
      expect(fn()).toBe(3);
    });

    it('should not mutate the original set', () => {
      const givenSet = [1, 2, 3, 4, 5];
      const fn = randomSet<number>(() => 0.01, givenSet);
      givenSet.forEach(fn);
      expect(givenSet).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('registerRandomTo function', () => {
    it('should throw if not given a random function', () => {
      expect(() => registerRandomTo({}, 'test', <() => number>{}))
        .toThrowError();
    });

    it('should throw if not given a truthy prop', () => {
      expect(() => registerRandomTo({}, '', <() => number>noop)).toThrowError();
    });

    it('should throw if prop is not a string', () => {
      expect(() => registerRandomTo({}, <string>{}, <() => number>noop))
        .toThrowError();
    });

    it('should not add the function to the collection if a truthy prop ' +
      'already exists', () => {
      const collection = { test: 'taken' };
      registerRandomTo(collection, 'test', <() => number>noop);
      expect(collection.test).toBe('taken');
    });

    it('should add a function to a collection', () => {
      const collection = { test: false };
      registerRandomTo(collection, 'test', <() => number>noop);
      expect(collection.test).toBe(noop);
    });
  });

  describe('shuffle function', () => {
    it('should shuffle an array based on a given random function', () => {
      const deck = [1, 2, 3, 4, 5];
      shuffle<number>(() => 0.01, deck);
      expect(deck).toEqual([ 2, 3, 4, 5, 1]);
    });
  });
});
