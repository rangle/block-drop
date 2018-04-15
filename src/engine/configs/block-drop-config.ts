/**
 * Block Drop
 */

import { deepFreeze } from '../../util';
import { GameConfigOptions } from '../../interfaces';

export const DEFAULT_CONFIG_1: GameConfigOptions = deepFreeze({
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
  canRotateLeft: 'canRotateLeft1',
  canRotateRight: 'canRotateRight1',
  createBoard: 'createBoard1',
  createBlock: 'createBlock',
  gamePadPollInterval: 110,
  forceBufferUpdateOnClear: false,
  preview: 0,
  randomMethod: 'randomFromSet',
  seedRandom: 'xor4096',
  spawn: 'spawn1',
  speed: 1000,
  startingFramework: 20 as 20,
  tick: 'tick1',
});
