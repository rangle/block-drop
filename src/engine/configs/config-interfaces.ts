import {
  functionsDetectClear,
} from '../board';

import {
  deepFreeze,
  isNumber,
  isString,
} from '../../util';

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
    default: functionsDetectClear.default,
    options: () => functionsDetectClear.list(),
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
]);
