import { Resolvers } from 'apollo-client';

import { TABLE_QUERY, EVENTS_MAP_QUERY } from './queries';
import { EventsMap } from 'components/timesheet/types';

export const resolvers: Resolvers = {
  Query: {
    roomEvents(_root, { timestamp, id }, { cache }) {
      const { table } = cache.readQuery({
        query: TABLE_QUERY,
      });
      const { eventsMap } = cache.readQuery({
        query: EVENTS_MAP_QUERY,
      });

      let roomEventsRanges: string[] = [];
      if (table.has(timestamp)) {
        roomEventsRanges = table.get(timestamp)[id];
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
        __typename: id,
      };
    },
  },
};
