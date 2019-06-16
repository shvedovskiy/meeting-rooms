import React from 'react';
import { render } from 'react-dom';

import './index.scss';
import { App } from './components/app/app';

render(<App />, document.getElementById('root') as HTMLElement);
