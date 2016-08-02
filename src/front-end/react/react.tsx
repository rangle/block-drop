import '../../license';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './containers/app-react';

// Global styles
import '../styles/index.css';

ReactDOM.render(
  <App />,
  document.getElementById('bd-root-react')
);
