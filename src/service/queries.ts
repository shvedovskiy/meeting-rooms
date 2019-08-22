import { gql } from 'apollo-boost';

import { UserData, RoomData, ServerEvent } from 'components/timesheet/types';

export const GET_USERS_ROOMS = gql`
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

export const GET_USERS_LOCAL = gql`
  {
    users @client {
      id
      login
      homeFloor
      avatarUrl
    }
  }
`;

export const GET_ROOMS_LOCAL = gql`
  {
    rooms @client {
      id
      title
      minCapacity
      maxCapacity
      floor
    }
  }
`;

export interface UsersQueryType {
  users: UserData[];
}

export interface RoomsQueryType {
  rooms: RoomData[];
}

export type UsersRoomsQueryType = UsersQueryType & RoomsQueryType;

export const GET_EVENTS = gql`
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
