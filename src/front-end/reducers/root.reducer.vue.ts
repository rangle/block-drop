import { combineReducers } from 'redux';
import { IState, rootObject } from './root.reducer.shared';
import { vueRouterReducer } from '../vue/router-reducer';

export const root = combineReducers<IState>(
  Object.assign({}, rootObject, {
    routing: combineReducers({ vue: vueRouterReducer }),
  }),
);
