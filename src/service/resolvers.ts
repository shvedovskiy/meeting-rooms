import { Resolvers } from 'apollo-client';

import { TABLE_QUERY } from './queries';

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
};
