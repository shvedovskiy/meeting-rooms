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
    if (operation.operationName === 'RoomsEvents' && response.data) {
      response.data.events = (response.data.events as ServerEvent[]).map(
        serverEvent => ({
          ...serverEvent,
          date: parseISO(serverEvent.date),
        })
      );
    } else {
      const method = [
        { name: 'CreateEvent', prop: 'createEvent' },
        { name: 'UpdateEvent', prop: 'updateEvent' },
        { name: 'RemoveEvent', prop: 'removeEvent' },
      ].find(op => op.name === operation.operationName);
      if (method && response.data) {
        response.data[method.prop].date = parseISO(
          (response.data[method.prop] as ServerEvent).date
        );
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
