/**
 * Random helper functions
 */
import {
  SeedRandom, 
} from '../interfaces';

import {
  partial,
} from '../util';

const seedRandom = require('seedrandom');

export const defaultRandom = seedRandom.xor4096;

const randomFunctions = {
  alea: seedRandom.alea,
  quick: seedRandom.quick,
  tychei: seedRandom.tychei,
  xor128: seedRandom.xor128,
  xor4096: seedRandom.xor4096,
  xorshift7: seedRandom.xorshift7,
  xorwow: seedRandom.xorwow,
};

export const getRandomFunction: SeedRandom =
  partial<SeedRandom>(getRandomFunctionFrom, randomFunctions);

export const listRandomFunctions: () => string[] =
  Object.keys.bind(Object, randomFunctions);

export const registerRandom: (prop: string, randomFunc: () => number) => void = 
  partial<(prop: string, randomFunc: () => number) => void>(
    registerRandomTo, randomFunctions);

/**
 * Generates a random integer using the given random function, assumes between
 * 0-max but min can be set
 */
export function between(randomFunc: () => number,
                        max: number,
                        min: number = 0) {
  if (min >= max) {
    throw new RangeError('between: minimum must be less than maximum');
  }

  return Math.floor((randomFunc() * (max - min)) + min);
}

export function getRandomFunctionFrom(collection: Object, fnName?: string) {
  if (collection[fnName]) {
    return collection[fnName];
  } 
  
  return defaultRandom;
}

/**
 * Returns a function that will return a random value from a given set, the
 * values will not duplicate until the set is exhausted
 */
export function randomSet<T>(randomFunc: () => number,
                          givenSet: T[]): () => T {

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
 * Adds `randomFunc` to `collection` as `prop` *if* `prop` does *not* exist on
 * `collection`
 */
export function registerRandomTo(collection: Object,
                        prop: string,
                        randomFunc: () => number) {
  if (typeof randomFunc !== 'function') {
    throw new TypeError('registerRandom requires a function');
  }
  
  if (!prop) {
    throw new TypeError('registerRandom requires a prop');
  }
  
  if (typeof prop !== 'string') {
    throw new TypeError('registerRandom requires prop to be a string');
  }
  
  if (collection[prop]) {
    return;
  }
  
  collection[prop] = randomFunc;
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
