import { combineReducers } from 'redux';
import { routerReducer as angularRouterReducer} from 'ng2-redux-router';
import { IState, rootObject } from './root.reducer.shared';


export const root = combineReducers<IState>(
  Object.assign({}, rootObject, {
    routing: combineReducers({ angular: angularRouterReducer }),
  }));
