/**
 * Match Clear
 */
import { GameConfigOptions } from '../../interfaces';

import { deepFreeze } from '../../util';

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

export const DEFAULT_CONFIG_1: GameConfigOptions = deepFreeze({
  width: 11,
  height: 25,
  blockDescriptions,
  canMoveUp: 'canMoveUp2',
  canMoveDown: 'canMoveDown1',
  canMoveLeft: 'canMoveLeft1',
  canMoveRight: 'canMoveRight1',
  canRotateLeft: 'canRotateLeft1',
  canRotateRight: 'canRotateRight1',
  connectedBlocks: 9,
  clearDelay: 1000,
  createBoard: 'createBoard1',
  createBlock: 'createBlock1',
  detectAndClear: 'detectAndClear2',
  dropOnUp: true,
  enableShadow: true,
  gamePadPollInterval: 110,
  preview: 0,
  randomMethod: 'randomFromSet',
  seedRandom: 'xor4096',
  spawn: 'spawn1',
  baseLevelScore: 1000,
  tileScoreMultiplier: 10,
  nextLevelMultiplier: 1.61803398875,
  speed: 750,
  speedMultiplier: 0.8,
  startingFramework: 20 as 20,
  tick: 'tick1',
});
