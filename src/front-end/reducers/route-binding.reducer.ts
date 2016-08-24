// synchronizes redux-routing solutions for angular/react
import { UPDATE_LOCATION } from 'ng2-redux-router';
import { LOCATION_CHANGE } from 'react-router-redux';
import { ROUTE_BINDING_BOOTSTRAP } from '../constants';

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
