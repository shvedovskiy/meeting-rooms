import './polyfills';
import React from 'react';
import { render } from 'react-dom';

import './index.scss';
import { App } from './components/app/app';

const hideLoader = () => {
  const loader = document.getElementById('loader') as HTMLDivElement;
  loader.classList.add('hidden');
  setTimeout(() => {
    loader.remove();
  }, 400);
};

render(<App onMount={hideLoader} />, document.getElementById(
  'root'
) as HTMLDivElement);
