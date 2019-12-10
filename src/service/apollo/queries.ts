import gql from 'graphql-tag';

import { UserData, RoomData, Event, EventsMap, Table } from 'components/timesheet/types';

export const USERS_QUERY = gql`
  {
    users {
      id
      login
      homeFloor
      avatarUrl
    }
  }
`;
export interface UsersQueryType {
  users: UserData[];
}

export const ROOMS_QUERY = `
  rooms {
    id
    title
    minCapacity
    maxCapacity
    floor
  }
`;
export interface RoomsQueryType {
  rooms: RoomData[];
}

export const EVENTS_QUERY = `
  events {
    id
    title
    date
    startTime
    endTime
    room {
      id
      title
      minCapacity
      maxCapacity
      floor
    }
    users {
      id
      login
      homeFloor
      avatarUrl
    }
  }
`;
export interface EventsQueryType {
  events: Event[];
}

export const TABLE_QUERY = `
  table @client(always: true)
`;
export interface TableQueryType {
  table: Table;
}

export const EVENTS_MAP_QUERY = `
  eventsMap @client(always: true)
`;
export interface EventsMapQueryType {
  eventsMap: EventsMap;
}

export const ROOM_EVENTS_QUERY = gql`
  query RoomEvents($timestamp: Number!, $id: String!) {
    roomEvents(timestamp: $timestamp, id: $id) @client(always: true) {
      ranges
      events
    }
  }
`;
export interface RoomEventsQueryType {
  roomEvents: {
    ranges: string[];
    events: EventsMap;
  };
}
