import boardFunctions from '../board';

import functionsRandom from '../random';

import { deepFreeze, isNumber, isString } from '../../util';

export const positiveInteger = deepFreeze({
  type: 'number',
  min: 0,
  is: x => isNumber(x) && x >= positiveInteger.min,
});

export const stringWithLength = deepFreeze({
  type: 'string',
  is: x => isString(x) && x,
});

export const configInterfaces = deepFreeze([
  {
    label: 'Detect/Clear Function',
    default: boardFunctions.detectAndClear.default,
    options: () => boardFunctions.detectAndClear.list(),
    prop: 'detectAndClear',
    type: 'select',
  },
  {
    label: 'Board Width',
    default: 11,
    min: 0,
    max: 1024,
    prop: 'width',
    type: 'number',
  },
  {
    label: 'Board Height',
    default: 25,
    min: 0,
    max: 1024,
    prop: 'height',
    type: 'number',
  },
  {
    label: 'Random Seed',
    prop: 'seed',
    type: 'string',
  },
  {
    label: 'Preview',
    prop: 'preview',
    type: 'number',
    min: 0,
  },
  {
    label: 'Random Method',
    default: 'randomFromSet',
    options: () => ['random', 'randomFromSet'],
    prop: 'randomMethod',
    type: 'select',
  },
  {
    label: 'Random Function',
    default: functionsRandom.default(),
    options: () => functionsRandom.list(),
    prop: 'seedRandom',
    type: 'select',
  },
]);
