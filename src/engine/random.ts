/**
 * Random helper functions
 */
import { makeCollection } from './function-collection';

const seedRandom = require('seedrandom');

export const defaultRandom = seedRandom.xor4096;

const functions = makeCollection<(seed: string) => () => number>(
  {
    alea: seedRandom.alea,
    quick: seedRandom.quick,
    tychei: seedRandom.tychei,
    xor128: seedRandom.xor128,
    xor4096: seedRandom.xor4096,
    xorshift7: seedRandom.xorshift7,
    xorwow: seedRandom.xorwow,
  },
  seedRandom.xor4096,
);
export default functions;

/**
 * Generates a random integer using the given random function, assumes between
 * 0-max but min can be set
 */
export function between(
  randomFunc: () => number,
  max: number,
  min: number = 0,
) {
  if (min >= max) {
    throw new RangeError('between: minimum must be less than maximum');
  }

  return Math.floor(randomFunc() * (max - min) + min);
}

/**
 * Returns a function that will return a random value from a given set, the
 * values will not duplicate until the set is exhausted
 */
export function randomSet<T>(randomFunc: () => number, givenSet: T[]): () => T {
  const randomOrder = shuffle<T>(randomFunc, givenSet.slice(0));
  let position = 0;

  return () => {
    if (position === randomOrder.length) {
      shuffle<T>(randomFunc, randomOrder);
      position = 0;
    }
    const ret = randomOrder[position];
    position += 1;

    return ret;
  };
}

/**
 * Implementation of Knuth's version of  the Fisher Yates shuffle
 *
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
export function shuffle<T>(randomFunc: () => number, arr: T[]): T[] {
  let curr = arr.length;

  // While there remain elements to shuffle...
  while (0 !== curr) {
    // Pick a remaining element...
    const rand = Math.floor(randomFunc() * curr);
    curr -= 1;

    // And swap it with the current element.
    [arr[curr], arr[rand]] = [arr[rand], arr[curr]];
  }

  return arr;
}
