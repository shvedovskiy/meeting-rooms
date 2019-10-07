import React from 'react';
import { render } from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { parseISO } from 'date-fns/esm';

import './index.scss';
import { App } from 'components/app/app';
import { SERVER_HOST, SERVER_PORT } from 'service/config';
import { resolvers } from 'service/resolvers';
import { ServerEvent } from 'components/timesheet/types';

const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader !== null) {
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.remove();
    }, 400);
  }
};

const serverEventTransformer = new ApolloLink((operation, forward) =>
  forward(operation).map(response => {
    if (operation.operationName === 'RoomsEvents' && response.data) {
      response.data.events = (response.data.events as ServerEvent[]).map(
        serverEvent => ({
          ...serverEvent,
          date: parseISO(serverEvent.date),
        })
      );
    }
    return response;
  })
);

const client = new ApolloClient({
  link: ApolloLink.from([
    serverEventTransformer,
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(
          ({ message, locations, path }) =>
            process.env.NODE_ENV === 'production' ||
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
      if (networkError) {
        process.env.NODE_ENV === 'production' ||
          console.log(`[Network error]: ${networkError}`);
      }
    }),
    new HttpLink({
      uri: `http://${SERVER_HOST}:${SERVER_PORT}/graphql`,
      fetchOptions: {},
      credentials: 'same-origin',
      headers: {},
    }),
  ]),
  resolvers,
  cache: new InMemoryCache(),
});

render(
  <ApolloProvider client={client}>
    <App onLoad={hideLoader} />
  </ApolloProvider>,
  document.getElementById('root') as HTMLDivElement
);
