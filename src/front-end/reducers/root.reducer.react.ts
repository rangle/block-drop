import { combineReducers } from 'redux';
import { routerReducer as reactRouterReducer } from 'react-router-redux';
import { IState, rootObject } from './root.reducer.shared';

export const root = combineReducers<IState>(
  Object.assign({}, rootObject, {
    routing: combineReducers({ react: reactRouterReducer }),
  }),
);
