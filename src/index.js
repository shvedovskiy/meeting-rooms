// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import invariant from 'invariant';

import App from './components/app/app';
import store from './store/configure-store';
import * as serviceWorker from './serviceWorker';

import './index.css';


const app = (
  <Provider store={store}>
    <App />
  </Provider>
);
const rootEl = document.getElementById('root');
invariant(rootEl !== null, 'Could not find the div with ID #root.');

render(app, rootEl);
serviceWorker.unregister();
