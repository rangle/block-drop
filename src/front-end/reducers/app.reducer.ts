import {
  CHANGE_FRAMEWORK,
  CHANGE_MULTI_FRAMEWORK,
  CHANGE_SCREEN,
} from '../actions/action-types';
import { deepFreeze } from '../../util';

export type Screen = 'config' | 'game';
export interface IApp {
  currentFramework: number; // matches index in frameworkDescriptions
  currentScreen: Screen;
  elementRoot: string;
  elementSplash: string;
  frameworkDescriptions: { id: string, name: string }[];
  screens: { id: Screen, name: string }[];
  useMultiFrameworks: boolean;
  version: string;
}

const FRAMEWORK_DESCRIPTIONS = deepFreeze([
  { id: 'bd-root-angular', name: 'Angular 2' },
  { id: 'bd-root-react', name: 'React' },
]);

const ROOT = 'bd-root';
const SPLASH = 'bd-splash';
const VERSION = '0.0.1';

const INIT: IApp = deepFreeze({
  currentFramework: -1,
  currentScreen: 'game',
  elementRoot: ROOT,
  elementSplash: SPLASH,
  frameworkDescriptions: FRAMEWORK_DESCRIPTIONS,
  screens: [{
    id: 'config',
    name: 'Config',
  }, {
    id: 'game',
    name: 'Game',
  }],
  useMultiFrameworks: false,
  version: VERSION,
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
