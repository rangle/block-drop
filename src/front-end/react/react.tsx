import '../../license';
import '../aspect-resizer';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../store/store';

import { Routes } from './routes-react';

// Global styles
import '../styles/index.css';

const REACT = 'bd-root-react';

declare const __STAND_ALONE__: boolean;

if (__STAND_ALONE__) {
  mount();
}

export function mount() {
  ReactDOM.render(
    <Provider store={ store }>
      <Routes></Routes>
    </Provider>,
    document.getElementById(REACT)
  );
}

export function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById(REACT));
}
