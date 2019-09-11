export interface UserData {
  id: string;
  login: string;
  homeFloor: number;
  avatarUrl: string | null;
}

export interface RoomData {
  id: string;
  title: string;
  floor: number;
  minCapacity: number | null;
  maxCapacity: number | null;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  users: UserData[];
  room: RoomData;
}

export interface ServerEvent extends Omit<Event, 'date'> {
  date: string;
}

export type NewEvent = Omit<Event, 'id'>;

export interface EventInput {
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export type RoomCard = RoomData & {
  startTime: string;
  endTime: string;
};

export type FloorDefinition = Map<number, RoomData[]>;

export type Table = Map<
  number,
  {
    [room: string]: Event[];
  }
>;
