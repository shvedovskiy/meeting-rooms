import { DataProxy } from 'apollo-cache';
import gql from 'graphql-tag';

import { EVENTS_QUERY, EventsQueryType, ROOM_EVENTS_QUERY } from './queries';
import {
  CreateEventMutationType,
  UpdateEventMutationType,
  RemoveEventMutationType,
} from './mutations';
import { Event } from 'components/timesheet/types';

export function updateCacheAfterUpdating(
  cache: DataProxy,
  mutationData?: CreateEventMutationType | UpdateEventMutationType | null
) {
  if (!mutationData) {
    return;
  }
  const query = gql`{${EVENTS_QUERY}}`;
  const cacheData = cache.readQuery({ query });
  if (!cacheData) {
    return;
  }
  const cacheEvents = (cacheData as EventsQueryType).events;
  let event: Event;
  if (mutationData.hasOwnProperty('createEvent')) {
    event = (mutationData as CreateEventMutationType).createEvent;
    cache.writeQuery({
      query,
      data: {
        events: cacheEvents.concat([event]),
      },
    });
  } else if (mutationData.hasOwnProperty('updateEvent')) {
    event = (mutationData as UpdateEventMutationType).updateEvent;
    cache.writeQuery({
      query,
      data: {
        events: cacheEvents.map(e => {
          if (e.id === event.id) {
            return event;
          }
          return e;
        }),
      },
    });
  }
}

export function updateCacheAfterRemoving(
  cache: DataProxy,
  mutationData?: RemoveEventMutationType | null
) {
  if (!mutationData) {
    return;
  }
  const query = gql`{${EVENTS_QUERY}}`;
  const cacheData = cache.readQuery({ query });
  if (!cacheData) {
    return;
  }
  const cacheEvents = (cacheData as EventsQueryType).events;
  cache.writeQuery({
    query,
    data: {
      events: cacheEvents.filter(e => e.id !== mutationData.removeEvent.id),
    },
  });
}

export function refetchQueriesAfterUpdating(
  mutationData?: CreateEventMutationType | UpdateEventMutationType | null,
  oldRoom?: string,
  oldDate?: Date
) {
  if (!mutationData) {
    return [];
  }
  const event = mutationData.hasOwnProperty('createEvent')
    ? (mutationData as CreateEventMutationType).createEvent
    : (mutationData as UpdateEventMutationType).updateEvent;
  const queries = [
    {
      query: ROOM_EVENTS_QUERY,
      variables: {
        timestamp: event.date.getTime(),
        id: event.room.id,
      },
    },
  ];
  if (oldDate || oldRoom) {
    queries.push({
      query: ROOM_EVENTS_QUERY,
      variables: {
        timestamp: (oldDate || event.date).getTime(),
        id: oldRoom || event.room.id,
      },
    });
  }
  return queries;
}

export function refetchQueriesAfterRemoving(
  mutationData?: RemoveEventMutationType | null
) {
  if (!mutationData) {
    return [];
  }
  const event = (mutationData as RemoveEventMutationType).removeEvent;
  return [
    {
      query: ROOM_EVENTS_QUERY,
      variables: {
        timestamp: event.date.getTime(),
        id: event.room.id,
      },
    },
  ];
}
