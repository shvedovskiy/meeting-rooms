import React from 'react';
import { render } from 'react-dom';

import './index.css';
import { App } from './components/app/app';

render(<App />, document.getElementById('root') as HTMLElement);
