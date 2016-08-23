import * as React from 'react';
import { store } from '../store/store';
import {
  browserHistory,
  hashHistory,
  IndexRoute,
  Route,
  Router,
} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { App, Config, Game } from './containers';
import { LOCATION_STRATEGY } from '../constants';

export let history;

const options = { selectLocationState: state => state.routing.react };

export function Routes() {
  if (LOCATION_STRATEGY === 'hash') {
    history = syncHistoryWithStore(hashHistory, store, options);
  } else {
    history = syncHistoryWithStore(browserHistory, store, options);
  }

  return (<Router history={ history }>
    <Route path='/' component={ App }>
      <IndexRoute component={ Game } />
      <Route path='/config' component={ Config } />
      <Route path='/game' component={ Game } />
      <Route path='**' component={ Game } />
    </Route>
  </Router>);
}
