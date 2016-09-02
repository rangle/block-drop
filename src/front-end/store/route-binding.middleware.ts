import {
  BD_ROUTE_UDPATE,
  routerActions,
} from '../reducers/route-binding.reducer';

export function routeBindingMiddleware(store) {
  return next => action => {
    if (routerActions[action.type]) {
      const path = routerActions[action.type].fromPayload(action.payload);
      store.dispatch({ type: BD_ROUTE_UDPATE, payload: path });
      next(action);
    } else {
      next(action);
    }
  };
}
