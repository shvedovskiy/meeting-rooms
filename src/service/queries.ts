import { gql } from 'apollo-boost';

import {
  UserData,
  RoomData,
  ServerEvent,
  Event,
} from 'components/timesheet/types';

export const ROOMS_QUERY = gql`
  {
    rooms {
      id
      title
      minCapacity
      maxCapacity
      floor
    }
  }
`;
export interface RoomsQueryType {
  rooms: RoomData[];
}

export const EVENTS_QUERY = gql`
  {
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
  }
`;
export interface EventsQueryType {
  events: ServerEvent[];
}

export const USERS_ROOMS_QUERY = gql`
  {
    users {
      id
      login
      homeFloor
      avatarUrl
    }
    rooms {
      id
      title
      minCapacity
      maxCapacity
      floor
    }
  }
`;
export interface UsersRoomsQueryType {
  users: UserData[];
  rooms: RoomData[];
}

export const ROOMS_EVENTS_QUERY = gql`
  {
    rooms {
      id
      title
      minCapacity
      maxCapacity
      floor
    }
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
  }
`;
export interface RoomsEventsQueryType {
  rooms: RoomData[];
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
