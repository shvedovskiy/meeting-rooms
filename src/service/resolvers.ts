import { Resolvers } from 'apollo-client';

import { FLOORS_QUERY, TABLE_QUERY } from './queries';

export const resolvers: Resolvers = {
  Query: {
    roomEvents(_root, { timestamp, id }, { cache }) {
      const cacheData = cache.readQuery({
        query: TABLE_QUERY,
      });
      if (cacheData.table && cacheData.table.has(timestamp)) {
        return cacheData.table.get(timestamp)[id];
      }
    },
  },
  Mutation: {
    writeFloors(_root, { floors }, { cache }) {
      cache.writeQuery({
        query: FLOORS_QUERY,
        data: { floors },
      });
    },
    writeTable(_root, { table }, { cache }) {
      cache.writeQuery({
        query: TABLE_QUERY,
        data: { table },
      });
    },
  },
};
