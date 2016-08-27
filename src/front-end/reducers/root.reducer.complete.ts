import { combineReducers } from 'redux';
import { routerReducer as angularRouterReducer} from 'ng2-redux-router';
import { routerReducer as reactRouterReducer } from 'react-router-redux';
import { routeBinding } from '../reducers/route-binding.reducer';
import { IState, rootObject } from './root.reducer.shared';


export const root = combineReducers<IState>(
  Object.assign({}, rootObject, {
    routing: routeBinding(combineReducers({
      angular: angularRouterReducer,
      react: reactRouterReducer,
    })),
  }));
