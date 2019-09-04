import { gql } from 'apollo-boost';

import {
  UserData,
  RoomData,
  ServerEvent,
  Event,
} from 'components/timesheet/types';

export const USERS_QUERY = `
  users {
    id
    login
    homeFloor
    avatarUrl
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
  events: ServerEvent[];
}

export const TABLE_QUERY = gql`
  {
    table @client(always: true)
  }
`;

export const ROOM_EVENTS_QUERY = gql`
  query RoomEvents($timestamp: Number!, $id: String!) {
    roomEvents(timestamp: $timestamp, id: $id) @client(always: true)
  }
`;
export interface RoomEventsQueryType {
  roomEvents: Event[];
}
