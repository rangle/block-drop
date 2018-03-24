import '../../license';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Routes } from './routes-react';
import { EngineStore } from '../store/store';
import { Resizer } from '../aspect-resizer';

const REACT = 'bd-root-react';

export function mount(store: EngineStore, resizer: Resizer) {
  ReactDOM.render(
    <Provider store={ store }>
      <Routes store={ store } resizer={ resizer }></Routes>
    </Provider>,
    document.getElementById(REACT)
  );
}

export function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById(REACT));
}
