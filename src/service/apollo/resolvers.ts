import { Resolvers } from 'apollo-client';
import gql from 'graphql-tag';

import { TABLE_QUERY, EVENTS_MAP_QUERY } from './queries';
import { EventsMap } from 'components/timesheet/types';

export const resolvers: Resolvers = {
  Query: {
    roomEvents(_root, { timestamp: day, id: roomId }, { cache }) {
      const { table } = cache.readQuery({
        query: gql`
          {
            ${TABLE_QUERY}
          }
        `,
      });
      const { eventsMap } = cache.readQuery({
        query: gql`
          {
            ${EVENTS_MAP_QUERY}
          }
        `,
      });

      let roomEventsRanges: string[] = [];
      if (table.get(day)?.[roomId]) {
        roomEventsRanges = table.get(day)[roomId];
      }

      // Grab event objects by event ids inside ranges:
      const roomEvents: EventsMap = new Map(
        Array.from(new Set(roomEventsRanges.filter(Boolean))).map(id => [
          id,
          eventsMap.get(id),
        ])
      );

      return {
        ranges: roomEventsRanges,
        events: roomEvents,
        __typename: roomId,
      };
    },
  },
};
