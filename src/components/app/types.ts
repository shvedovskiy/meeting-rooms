import {
  Event,
  NewEvent,
  UserData,
  RoomData,
} from 'components/timesheet/types';

export interface ContextData {
  users: UserData[] | null;
  rooms: RoomData[] | null;
  event: Event | NewEvent;
}

export interface QueryType {
  users: UserData[];
  rooms: RoomData[];
}
