import gql from 'graphql-tag';

import { ServerEvent } from 'components/timesheet/types';

export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($userIds: [ID!], $roomId: ID!, $input: EventInput!) {
    createEvent(userIds: $userIds, roomId: $roomId, input: $input) {
      id
      title
      date
      startTime
      endTime
      room {
        title
        floor
      }
    }
  }
`;

export interface CreateEventMutationType {
  createEvent: ServerEvent;
}

export const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent($input: UpdateEventInput!, $id: ID!) {
    updateEvent(input: $input, id: $id) {
      id
      title
      date
      startTime
      endTime
      room {
        title
        floor
      }
    }
  }
`;

export interface UpdateEventMutationType {
  updateEvent: ServerEvent;
}

export const REMOVE_EVENT_MUTATION = gql`
  mutation RemoveEvent($id: ID!) {
    removeEvent(id: $id) {
      id
    }
  }
`;

export const ADD_USERS_TO_EVENT_MUTATION = gql`
  mutation AddUsersToEvent($id: ID!, $userIds: [String!]!) {
    addUsersToEvent(id: $id, userIds: $userIds) {
      id
    }
  }
`;

export const REMOVE_USERS_FROM_EVENT_MUTATION = gql`
  mutation RemoveUsersFromEvent($id: ID!, $userIds: [String!]!) {
    removeUsersFromEvent(id: $id, userIds: $userIds) {
      id
    }
  }
`;

export const CHANGE_EVENT_ROOM_MUTATION = gql`
  mutation ChangeEventRoom($id: ID!, $roomId: String!) {
    changeEventRoom(id: $id, roomId: $roomId) {
      id
    }
  }
`;
