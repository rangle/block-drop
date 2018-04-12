import { combineReducers } from 'redux';
import { IState, rootObject } from './root.reducer.shared';
import { angularRouterReducer } from '../angular/router-reducer';

export const root = combineReducers<IState>(
  Object.assign({}, rootObject, {
    routing: combineReducers({ angular: angularRouterReducer }),
  }),
);
