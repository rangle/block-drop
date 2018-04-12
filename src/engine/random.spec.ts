import { between, randomSet, shuffle } from './random';

import { noop } from '../util';

describe('random number functions', () => {
  describe('between function', () => {
    it('should throw if minimum is less than maximum', () => {
      expect(() => between(<() => number>noop, 10, 11)).toThrowError();
    });

    it('should return min if given a random value close to zero', () => {
      expect(between(() => 0.01, 10, 2)).toBe(2);
    });

    it('should return zero if given a random value close to zero and no min', () => {
      expect(between(() => 0.01, 10)).toBe(0);
    });

    it('should return max number - 1 if given a random value close to one', () => {
      expect(between(() => 0.999, 10)).toBe(9);
    });
  });

  describe('randomSet function', () => {
    it('should provide a function that returns a random element from a set', () => {
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

  describe('shuffle function', () => {
    it('should shuffle an array based on a given random function', () => {
      const deck = [1, 2, 3, 4, 5];
      shuffle<number>(() => 0.01, deck);
      expect(deck).toEqual([2, 3, 4, 5, 1]);
    });
  });
});
