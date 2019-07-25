import { UserData, RoomData } from './types';

export const HOURS = [
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
];

export const users: UserData[] = [
  {
    id: '3434',
    login: 'Первый участник',
    homeFloor: 42,
    avatarUrl: 'http://localhost:5000/a',
  },
  {
    id: '343цук4',
    login: 'Второй участник',
    homeFloor: 42,
    avatarUrl: 'http://localhost:5000/a',
  },
  {
    id: 'lsd;fsd',
    login: 'Третий участник',
    homeFloor: 42,
    avatarUrl: 'http://localhost:5000/a',
  },
];

export const rooms: RoomData[] = [
  {
    id: 'Room 1',
    name: 'Room 1',
    floor: 1,
    capacity: new Map([['min', 3], ['max', 6]]),
    available: false,
  },
  {
    id: 'Room 2',
    name: 'Room 2',
    floor: 1,
    capacity: new Map([['min', 3], ['max', 6]]),
    available: true,
  },
  {
    id: 'Room 3',
    name: 'Room 3',
    floor: 1,
    capacity: new Map([['min', 3], ['max', 6]]),
    available: true,
  },
];