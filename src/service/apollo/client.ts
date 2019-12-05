import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { parseISO } from 'date-fns/esm';

import { SERVER_URL } from 'service/config';
import { resolvers } from 'service/apollo/resolvers';
import { ServerEvent } from 'components/timesheet/types';

const serverEventTransformer = new ApolloLink((operation, forward) =>
  forward(operation).map(response => {
    if (response.data) {
      let methods, prop;
      switch (operation.operationName) {
        case 'RoomsEvents':
        case 'MoveEvents':
          methods = {
            RoomsEvents: 'events',
            MoveEvents: 'updateEvents',
          };
          prop = methods[operation.operationName];
          if (response.data[prop]) {
            response.data[prop] = (response.data[prop] as ServerEvent[]).map(
              serverEvent => ({
                ...serverEvent,
                date: parseISO(serverEvent.date),
              })
            );
          }
          break;
        case 'CreateEvent':
        case 'UpdateEvent':
        case 'RemoveEvent':
          methods = {
            CreateEvent: 'createEvent',
            UpdateEvent: 'updateEvent',
            RemoveEvent: 'removeEvent',
          };
          prop = methods[operation.operationName];
          if (response.data[prop]) {
            response.data[prop].date = parseISO(
              (response.data[prop] as ServerEvent).date
            );
          }
      }
    }
    return response;
  })
);

export const apolloClient = new ApolloClient({
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
      uri: `${SERVER_URL}/graphql`,
      fetchOptions: {},
      credentials: 'same-origin',
      headers: {},
    }),
  ]),
  resolvers,
  cache: new InMemoryCache(),
});
