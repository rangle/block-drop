import {
  CHANGE_FRAMEWORK,
  CHANGE_MULTI_FRAMEWORK,
} from '../constants';
import { deepFreeze } from '../../util';

export interface IAppState {
  boardLandscapeLimits: { x: number, y: number };
  boardPortraitLimits: { x: number, y: number };
  currentFramework: number; // matches index in frameworkDescriptions
  useMultiFrameworks: boolean;
}


const INIT: IAppState = deepFreeze({
  boardLandscapeLimits: { x: 0.25, y: 0 },
  boardPortraitLimits: { x: 0, y: 0.25 },
  currentFramework: -1,
  useMultiFrameworks: false,
});

export function app(state = INIT, action) {
  switch (action.type) {
    case CHANGE_FRAMEWORK:
      return Object.assign({}, state, {
        currentFramework: action.payload,
      });

    case CHANGE_MULTI_FRAMEWORK:
      return Object.assign({}, state, {
        useMultiFrameworks: action.payload,
      });

    default:
      return state;
  }
}
