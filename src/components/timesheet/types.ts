export interface UserData {
  id: string;
  login: string;
  homeFloor: number;
  avatarUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  participants?: UserData[];
  room: RoomData;
}

export interface NewEvent {
  date: Date;
  startTime: string;
  endTime: string;
  room: RoomData;
}

export type RoomCapacity = Map<string, number>;

export interface RoomData {
  id: string;
  name: string;
  floor: number;
  capacity: RoomCapacity;
  available: boolean;
}

export type RoomCard = RoomData & {
  startTime: string;
  endTime: string;
};

export interface RoomEvents {
  [room: string]: Event[];
}

export interface FloorDefinition {
  floor: number;
  rooms?: RoomData[];
}

export type Table = Map<number, RoomEvents>;
