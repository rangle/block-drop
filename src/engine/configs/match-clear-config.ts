/**
 * Match Clear
 */
import { GameConfig } from '../../interfaces';

import {
  createBlock,
} from '../block';

import {
  canMoveDown,
  canMoveLeft,
  canMoveRight,
  canRotateLeft1,
  canRotateRight1,
  createBoard1,
} from '../board';

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
        desc: [[i * 10], [j * 10], [k * 10]],
        name: `${i * 10}.${j * 10}.${k * 10}`,
      });
    }
  }
}

export const DEFAULT_CONFIG_1: GameConfig = deepFreeze({
  width: 11,
  height: 25,
  blockDescriptions,
  canMoveUp: () => true,
  canMoveDown,
  canMoveLeft,
  canMoveRight,
  canRotateLeft: canRotateLeft1,
  canRotateRight: canRotateRight1,
  checkForLoss: checkForLoss1,
  connectedBlocks: 9,
  clearDelay: 1000,
  createBoard: createBoard1,
  createBlock: createBlock,
  dropOnUp: true,
  enableShadow: true,
  forceBufferUpdateOnClear: true,
  gameOver: gameOver1,
  detectAndClear: 'detectAndClear2',
  preview: 0,
  randomMethod: defaultRandom, // 'randomFromSet',
  seedRandom: 'xor4096',
  spawn: spawn1,
  baseLevelScore: 1000,
  tileScoreMultiplier: 10,
  nextLevelMultiplier: 1.61803398875,
  speed: 750,
  speedMultiplier: 0.8,
  tick: tick1,
});

