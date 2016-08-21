import {
  CHANGE_FRAMEWORK,
  CHANGE_MULTI_FRAMEWORK,
  CHANGE_SCREEN,
} from '../constants';
import { deepFreeze } from '../../util';

export type Screen = 'config' | 'game' | 'start-game';

export interface IAppState {
  boardLandscapeLimits: { x: number, y: number };
  boardPortraitLimits: { x: number, y: number };
  currentFramework: number; // matches index in frameworkDescriptions
  currentScreen: Screen;
  useMultiFrameworks: boolean;
}


const INIT: IAppState = deepFreeze({
  boardLandscapeLimits: { x: 0.25, y: 0 },
  boardPortraitLimits: { x: 0, y: 0.25 },
  currentFramework: -1,
  currentScreen: 'start-game',
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

    case CHANGE_SCREEN:
      return Object.assign({}, state, {
        currentScreen: action.payload,
      });

    default:
      return state;
  }
}
