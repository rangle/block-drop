import { CHANGE_FRAMEWORK } from '../actions/action-types';

export interface IFramework {
  active: 'angular' | 'react';
  frameworks: string[];
}

const INIT: IFramework = {
  active: 'react',
  frameworks: ['angular', 'react'],
};

export function framework(state = INIT, action) {
  switch (action.type) {
    case CHANGE_FRAMEWORK:
      return Object.assign({}, state, {
        active: action.payload,
      });
    default:
      return state;
  }
}
