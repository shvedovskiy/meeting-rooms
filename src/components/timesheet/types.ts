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
  available: boolean;
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
  date?: Date;
  startTime?: string;
  endTime?: string;
  room?: RoomData;
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
