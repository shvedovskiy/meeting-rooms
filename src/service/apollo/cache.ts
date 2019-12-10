import { DataProxy } from 'apollo-cache';
import gql from 'graphql-tag';

import { EVENTS_QUERY, EventsQueryType, ROOM_EVENTS_QUERY } from './queries';
import {
  CreateEventMutation,
  UpdateEventMutation,
  MoveEventsMutation,
  RemoveEventMutation,
} from './mutations';
import { Event } from 'components/timesheet/types';
import { EventToMove } from 'components/form/form-common/types';

export function updateCacheAfterStoring(
  cache: DataProxy,
  mutationData?: CreateEventMutation | UpdateEventMutation | null
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
    event = (mutationData as CreateEventMutation).createEvent;
    cache.writeQuery({
      query,
      data: {
        events: cacheEvents.concat([event]),
      },
    });
  } else if (mutationData.hasOwnProperty('updateEvent')) {
    event = (mutationData as UpdateEventMutation).updateEvent;
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

export function updateCacheAfterMoving(
  cache: DataProxy,
  mutationData?: MoveEventsMutation | null
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
  const movedEvents = mutationData.updateEvents;
  cache.writeQuery({
    query,
    data: {
      events: cacheEvents.map(cacheEvent => {
        const found = movedEvents.find(e => cacheEvent.id === e.id);
        if (found) {
          return found;
        }
        return cacheEvent;
      }),
    },
  });
}

export function updateCacheAfterRemoving(
  cache: DataProxy,
  mutationData?: RemoveEventMutation | null
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

export function refetchQueriesAfterStoring(
  mutationData?: CreateEventMutation | UpdateEventMutation | null,
  oldRoom?: string,
  oldDate?: Date
) {
  if (!mutationData) {
    return [];
  }
  const event = mutationData.hasOwnProperty('createEvent')
    ? (mutationData as CreateEventMutation).createEvent
    : (mutationData as UpdateEventMutation).updateEvent;
  const queries = [
    {
      query: ROOM_EVENTS_QUERY,
      variables: {
        id: event.room.id,
        timestamp: event.date.getTime(),
      },
    },
  ];
  if (oldDate || oldRoom) {
    queries.push({
      query: ROOM_EVENTS_QUERY,
      variables: {
        id: oldRoom ?? event.room.id,
        timestamp: (oldDate ?? event.date).getTime(),
      },
    });
  }
  return queries;
}

export function refetchQueriesAfterMoving(
  mutationData?: MoveEventsMutation,
  oldData?: EventToMove[]
) {
  if (!mutationData) {
    return [];
  }
  const movedEvents = mutationData.updateEvents;
  let queries = movedEvents.map(event => ({
    query: ROOM_EVENTS_QUERY,
    variables: {
      id: event.room.id,
      timestamp: event.date.getTime(),
    },
  }));
  if (oldData) {
    queries = queries.concat(
      oldData.map(event => ({
        query: ROOM_EVENTS_QUERY,
        variables: {
          id: event.prevRoom,
          timestamp: movedEvents.find(e => e.id === event.id)!.date.getTime(),
        },
      }))
    );
  }
  return queries;
}

export function refetchQueriesAfterRemoving(mutationData?: RemoveEventMutation | null) {
  if (!mutationData) {
    return [];
  }
  const event = (mutationData as RemoveEventMutation).removeEvent;
  return [
    {
      query: ROOM_EVENTS_QUERY,
      variables: {
        id: event.room.id,
        timestamp: event.date.getTime(),
      },
    },
  ];
}
