// synchronizes redux-routing solutions for angular/react
import { ROUTE_BINDING_BOOTSTRAP } from '../constants';
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
const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
const UPDATE_LOCATION = 'ng2-redux-router::UPDATE_LOCATION';

export const routerActions = {};

Object.defineProperty(routerActions, LOCATION_CHANGE, {
  configurable: false,
  enumerable: true,
  value: {
    newState: (path, state) => {
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
      state.react.locationBeforeTransitions = Object
        .assign({}, state.react.locationBeforeTransitions, { pathname: path });
      return state;
    },
    fromPayload: (payload) => payload.pathname,
  },
  writable: false,
});

Object.defineProperty(routerActions, UPDATE_LOCATION, {
  configurable: false,
  enumerable: true,
  value: {
    newState: (path, state) => Object.assign({}, state, { angular: path }),
    fromPayload: (payload) => payload,
  },
  writable: false,
});

Object.defineProperty(routerActions, ROUTE_BINDING_BOOTSTRAP, {
  configurable: false,
  enumerable: true,
  value: {
    newState: (path, state) => Object.assign({}, state, { angular: path }),
    fromPayload: (payload) => payload,
  },
  writable: false,
});

export function routeBinding(reducer) {
  return (state, action) => {

    let newState = state;

    if (routerActions[action.type]) {
      Object.keys(routerActions)
        .forEach((type) => {
          if (type === action.type) {
            return;
          }

          newState = routerActions[type]
            .newState(routerActions[action.type]
              .fromPayload(action.payload), state);
        });
    }

    return reducer(newState, action);
  };
}
