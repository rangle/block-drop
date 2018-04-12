import { combineReducers } from 'redux';
import { routerReducer as reactRouterReducer } from 'react-router-redux';
import { routeBinding } from '../reducers/route-binding.reducer';
import { IState, rootObject } from './root.reducer.shared';
import { vueRouterReducer } from '../vue/router-reducer';
import { angularRouterReducer } from '../angular/router-reducer';

export const root = combineReducers<IState>(
  Object.assign({}, rootObject, {
    routing: routeBinding(
      combineReducers({
        angular: angularRouterReducer,
        react: reactRouterReducer,
        vue: vueRouterReducer,
      }),
      undefined,
    ),
  }),
);
