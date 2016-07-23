/**
 * Default configuration
 */

import {
  createBlock,
  spawn1,
} from './block';

import {
  canRotateLeft1,
  canRotateRight1,
  createBoard1,
  detectAndClear1,
} from './board';

import {
  RandomMethod,
} from './interfaces';

import {
  defaultRandom,
} from './random';

import {
  deepFreeze,
} from './util';

export const DEFAULT_CONFIG_1 = deepFreeze({
  width: 11,
  height: 25,
  blockDescriptions: [
    {
      desc: [[1]],
      name: 'הצומת',
    },
    {
      desc: [[1], [1], [1]],
      name: 'the stub',
    },
    {
      desc: [[1, 0], [0, 1], [1, 0]],
      name: 'la esquina',
    },
    {
      desc: [[1], [1], [1], [1], [1]],
      name: '棒子',
    },
    {
      desc: [[1, 1], [1, 1], [1, 1]],
      name: 'das bett',
    },
    {
      desc: [[1, 1, 1], [0, 0, 1], [1, 1, 1]],
      name: 'магнит',
    },
    {
      desc: [[1, 1, 1], [1, 0, 1], [1, 1, 1]],
      name: 'le piège',
    },
    {
      desc: [[1, 0], [1, 0], [1, 0], [1, 1]],
      name: 'पैर',
    },
    {
      desc: [[0, 1], [0, 1], [0, 1], [1, 1]],
      name: 'عصا الهوكي',
    },
  ],
  canRotateLeft: canRotateLeft1,
  canRotateRight: canRotateRight1,
  createBoard: createBoard1,
  createBlock: createBlock,
  detectAndClear: detectAndClear1,
  preivew: 0,
  randomMethod: RandomMethod.RandomFromSet,
  seedRandom: defaultRandom,
  spawn: spawn1,
  speed: 1000,
});

