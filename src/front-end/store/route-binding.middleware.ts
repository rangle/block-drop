import { routerActions } from '../reducers/route-binding.reducer';
import { BD_ROUTE_UPDATE } from '../constants';

export function routeBindingMiddleware(store) {
  return next => action => {
    if (routerActions[action.type]) {
      const path = routerActions[action.type].fromPayload(action.payload);
      store.dispatch({ type: BD_ROUTE_UPDATE, payload: path });
      next(action);
    } else {
      next(action);
    }
  };
}
