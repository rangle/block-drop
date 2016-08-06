/**
 * Match Clear
 */

import {
  createBlock,
} from '../block';

import {
  canRotateLeft1,
  canRotateRight1,
  createBoard1,
  detectAndClear2,
} from '../board';

import {
  RandomMethod,
} from '../../interfaces';

import {
  defaultRandom,
} from '../random';

import {
  checkForLoss1,
  gameOver1,
  spawn1,
  tick1,
} from '../rules';

import {
  deepFreeze,
} from '../../util';

const blockDescriptions = [];

for (let i = 1; i < 4; i += 1) {
  for (let j = 1; j < 4; j += 1) {
    for (let k = 1; k < 4; k += 1) {
      blockDescriptions.push({
        desc: [[i], [j], [k]],
        name: `${i}.${j}.${k}`,
      });
    }
  }
}

export const DEFAULT_CONFIG_1 = deepFreeze({
  width: 11,
  height: 25,
  blockDescriptions,
  canRotateLeft: canRotateLeft1,
  canRotateRight: canRotateRight1,
  checkForLoss: checkForLoss1,
  createBoard: createBoard1,
  createBlock: createBlock,
  forceBufferUpdateOnClear: true,
  gameOver: gameOver1,
  detectAndClear: 'detectAndClear2',
  preview: 0,
  randomMethod: RandomMethod.RandomFromSet,
  seedRandom: defaultRandom,
  spawn: spawn1,
  speed: 1000,
  tick: tick1,
});

