import React from 'react';
import { render } from 'react-dom';
// import { Provider } from 'react-redux';

import App from './components/app/app';
// import { store } from './store/configure-store';
import * as serviceWorker from './serviceWorker';
import { isProdEnv } from './service/config';

import './index.css';

render(<App />, document.getElementById('root') as HTMLElement);

if (!isProdEnv) {
  serviceWorker.unregister();
}
