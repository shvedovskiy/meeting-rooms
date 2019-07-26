import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import './index.scss';
import { App } from 'components/app/app';
import { SERVER_HOST, SERVER_PORT } from 'service/config';

const hideLoader = () => {
  const loader = document.getElementById('loader') as HTMLDivElement;
  loader.classList.add('hidden');
  setTimeout(() => {
    loader.remove();
  }, 400);
};

const client = new ApolloClient({
  uri: `http://${SERVER_HOST}:${SERVER_PORT}/graphql`,
});

render(
  <ApolloProvider client={client}>
    <App onLoad={hideLoader} />
  </ApolloProvider>,
  document.getElementById('root') as HTMLDivElement
);
