import { CHANGE_FRAMEWORK, CHANGE_MULTI_FRAMEWORK } from '../constants';
import { deepFreeze, mergeProp, partial } from '../../util';
import { BD_ROUTE_UPDATE, ROUTES } from '../constants';

export interface IAppState {
  boardLandscapeLimits: { x: number; y: number };
  boardPortraitLimits: { x: number; y: number };
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

export function app(state = INIT, { payload, type }) {
  const bMergeProp: (prop: string) => any = partial(mergeProp, state, payload);

  switch (type) {
    case BD_ROUTE_UPDATE:
      return Object.assign({}, state, {
        routes: ROUTES.filter(partial(routesFilter, payload)),
      });

    case CHANGE_FRAMEWORK:
      return bMergeProp('currentFramework');

    case CHANGE_MULTI_FRAMEWORK:
      return bMergeProp('useMultiFrameworks');

    default:
      return state;
  }
}

export function routesFilter(payload, el) {
  return el.path !== payload && `/${el.path}` !== payload;
}
