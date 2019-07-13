export interface UserData {
  id: string;
  login: string;
  homeFloor: number;
  avatarUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  dateStart: Date;
  dateEnd: Date;
  roomTitle: string;
  participants?: UserData[];
}

export type RoomCapacity = Map<string, number>;

export interface RoomData {
  name: string;
  floor: number;
  capacity: RoomCapacity;
  available: boolean;
  events?: Event[];
}

export interface FloorDefinition {
  number: number;
  rooms?: RoomData[];
}
