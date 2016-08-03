import '../../license';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './containers/app-react';

import { store } from '../store/store';

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
      <App></App>
    </Provider>,
    document.getElementById(REACT)
  );
}

export function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById(REACT));
}
