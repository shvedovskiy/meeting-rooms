import gql from 'graphql-tag';

import { EventInput, Event } from 'components/timesheet/types';

export interface CreateEventVariables {
  input: EventInput;
  roomId: string;
  userIds: string[];
}

export interface UpdateEventVariables {
  id: string;
  input?: Partial<EventInput>;
  roomId?: string;
  userIds?: string[];
}

export interface RemoveEventVariables {
  id: string;
}

export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($userIds: [ID!], $roomId: ID!, $input: EventInput!) {
    createEvent(userIds: $userIds, roomId: $roomId, input: $input) {
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

export interface CreateEventMutationType {
  createEvent: Event;
}

export const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent(
    $id: ID!
    $input: UpdateEventInput
    $roomId: ID
    $userIds: [ID!]
  ) {
    updateEvent(id: $id, input: $input, roomId: $roomId, userIds: $userIds) {
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

export interface UpdateEventMutationType {
  updateEvent: Event;
}

export const REMOVE_EVENT_MUTATION = gql`
  mutation RemoveEvent($id: ID!) {
    removeEvent(id: $id) {
      id
      date
      room {
        id
      }
    }
  }
`;

export interface RemoveEventMutationType {
  removeEvent: Event;
}
