import {
  CHANGE_FRAMEWORK,
  CHANGE_MULTI_FRAMEWORK,
} from '../constants';
import { deepFreeze } from '../../util';
import { ROUTES } from '../constants';
import { BD_ROUTE_UDPATE } from '../reducers/route-binding.reducer';

export interface IAppState {
  boardLandscapeLimits: { x: number, y: number };
  boardPortraitLimits: { x: number, y: number };
  currentFramework: number; // matches index in frameworkDescriptions
  routes: { path: string }[];
  useMultiFrameworks: boolean;
}


const INIT: IAppState = deepFreeze({
  boardLandscapeLimits: { x: 0.25, y: 0 },
  boardPortraitLimits: { x: 0, y: 0.25 },
  currentFramework: -1,
  routes: ROUTES,
  useMultiFrameworks: false,
});

export function app(state = INIT, action) {
  switch (action.type) {
    case BD_ROUTE_UDPATE:
      return Object.assign({}, state, {
        routes: ROUTES
          .filter((el) => el.path !== action.payload &&
          `/${el.path}` !== action.payload),
      });

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
