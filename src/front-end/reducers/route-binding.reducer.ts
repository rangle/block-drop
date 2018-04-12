// synchronizes redux-routing solutions for angular/react
import { ROUTE_BINDING_BOOTSTRAP } from '../constants';
import { VUE_LOCATION_CHANGE } from '../vue/router-reducer';
import { Dictionary } from '../../interfaces';
import { deepFreeze, identity, partial, pluck } from '../../util';
/**
 *  Normally we would import our third party constants like so:
 *
 * import { UPDATE_LOCATION } from 'ng2-redux-router';
 * import { LOCATION_CHANGE } from 'react-router-redux';
 *
 * *HOWEVER* this would break the builds in the sense that irrelevant
 * frameworks would end up being included in framework specific builds.
 *
 * Instead we'll hard code them here and do manual updates.
 */
export const THIRD_PARTY_TYPES = deepFreeze([
  '@@router/LOCATION_CHANGE',
  '@angular-redux/router::UPDATE_LOCATION',
  VUE_LOCATION_CHANGE,
]);

const R_LOCATION_CHANGE = THIRD_PARTY_TYPES[0];
const NG_UPDATE_LOCATION = THIRD_PARTY_TYPES[1];

export interface RouterAction<S, P> {
  newState(path: string, state: S): S; // calculates new route state based on
  // pathname
  fromPayload(payload: P): string; // gets pathname from payload
}

export type RouterActions = Dictionary<RouterAction<any, any>>;

export const routerActions: RouterActions = {};

Object.defineProperty(routerActions, R_LOCATION_CHANGE, {
  configurable: false,
  enumerable: true,
  value: {
    newState: newState_LOCATION_CHANGE,
    fromPayload: partial(pluck, 'pathname'),
  },
  writable: false,
});

Object.defineProperty(routerActions, NG_UPDATE_LOCATION, {
  configurable: false,
  enumerable: true,
  value: {
    newState: newState_UPDATE_LOCATION,
    fromPayload: identity,
  },
  writable: false,
});

Object.defineProperty(routerActions, VUE_LOCATION_CHANGE, {
  configurable: false,
  enumerable: true,
  value: {
    newState: newState_VUE_LOCATION_CHANGE,
    fromPayload: identity,
  },
  writable: false,
});

Object.defineProperty(routerActions, ROUTE_BINDING_BOOTSTRAP, {
  configurable: false,
  enumerable: true,
  value: {
    newState: newState_UPDATE_LOCATION,
    fromPayload: identity,
  },
  writable: false,
});

export function newState_UPDATE_LOCATION(path, state) {
  return Object.assign({}, state, { angular: path });
}

export function newState_VUE_LOCATION_CHANGE(path, state) {
  return Object.assign({}, state, { vue: path });
}

export function newState_LOCATION_CHANGE(path, state) {
  if (!state.react.locationBeforeTransitions) {
    state.react.locationBeforeTransitions = {
      pathname: path,
      search: '',
      hash: '',
      state: null,
      action: 'OVERRIDE',
      key: 'not null',
      query: {},
      $searchBase: {},
    };
    return state;
  }
  state.react.locationBeforeTransitions = Object.assign(
    {},
    state.react.locationBeforeTransitions,
    { pathname: path },
  );
  return state;
}

export const routeBinding = partial<(state: any, action: { type: any }) => any>(
  routeBindingOn,
  routerActions,
);

/**
 * Note I, onus is on the routerAction's newState method to return a new
 * reference
 *
 * Note II, routerActions can override each other.  Order is not guaranteed due
 * to JS Objects being used as the Map
 */
export function routeBindingOn(actions: RouterActions, reducer) {
  return (state, action) => {
    let newState = state;
    if (actions[action.type]) {
      const path = actions[action.type].fromPayload(action.payload);
      Object.keys(actions).forEach(type => {
        if (type === action.type) {
          return;
        }

        newState = actions[type].newState(path, newState);
      });
    }

    return reducer(newState, action);
  };
}
