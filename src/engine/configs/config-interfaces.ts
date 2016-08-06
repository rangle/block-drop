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
    default: functionsDetectClear.default,
    options: () => functionsDetectClear.list(),
    prop: 'detectAndClear',
    type: 'select',
  }
]);
