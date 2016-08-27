import * as React from 'react';
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
import { Resizer } from '../aspect-resizer';
import { EngineStore } from '../store/store';

export let history;

const options = { selectLocationState: state => state.routing.react };

export function wrap(resizer: Resizer, store: EngineStore, CompToWrap) {
  return React.createClass({
    render: function wrappedRender() {
      return (
        <CompToWrap {...this.props}
          resizer={ resizer }
          store={ store }/>);
    },
  });
}

export function Routes({ resizer, store }) {
  if (LOCATION_STRATEGY === 'hash') {
    history = syncHistoryWithStore(hashHistory, store, options);
  } else {
    history = syncHistoryWithStore(browserHistory, store, options);
  }

  const WrappedApp = wrap(resizer, store, App);
  const WrappedConfig = wrap(resizer, store, Config);
  const WrappedGame = wrap(resizer, store, Game);

  return (<Router history={ history }>
    <Route path='/' component={ WrappedApp }>
      <IndexRoute component={ WrappedGame } />
      <Route path='/config' component={ WrappedConfig } />
      <Route path='/game' component={ WrappedGame } />
      <Route path='**' component={ WrappedGame } />
    </Route>
  </Router>);
}
