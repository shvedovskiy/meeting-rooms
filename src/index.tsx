import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';

import './index.scss';
import { App } from 'components/app/app';
import { apolloClient } from 'service/apollo/client';

const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader !== null) {
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.remove();
    }, 400);
  }
};

render(
  <ApolloProvider client={apolloClient}>
    <App onLoad={hideLoader} />
  </ApolloProvider>,
  document.getElementById('root') as HTMLDivElement
);
