import gql from 'graphql-tag';

import { EventInput, Event } from 'components/timesheet/types';

export interface CreateEventVars {
  input: EventInput;
  roomId: string;
  userIds: string[];
}

export interface UpdateEventVars {
  id: string;
  input?: Partial<EventInput>;
  roomId?: string;
  userIds?: string[];
}

export interface MoveEventsVars {
  events: Partial<UpdateEventVars[]>;
}

export interface RemoveEventVars {
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

export interface CreateEventMutation {
  createEvent: Event;
}

export const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent(
    $id: ID!
    $input: EventUpdateInput
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

export interface UpdateEventMutation {
  updateEvent: Event;
}

export const MOVE_EVENTS_MUTATION = gql`
  mutation MoveEvents($events: [UpdateInput!]!) {
    updateEvents(events: $events) {
      id
      date
      startTime
      endTime
      room {
        id
      }
    }
  }
`;

export interface MoveEventsMutation {
  updateEvents: Event[];
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

export interface RemoveEventMutation {
  removeEvent: Event;
}
