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
    avatarUrl: 'http://localhost:4000/avatars/a',
  },
  {
    id: '343цук4',
    login: 'Второй участник',
    homeFloor: 42,
    avatarUrl: 'http://localhost:4000/avatars/a',
  },
  {
    id: 'lsd;fsd',
    login: 'Третий участник',
    homeFloor: 42,
    avatarUrl: 'http://localhost:4000/avatars/a',
  },
];

export const rooms: RoomData[] = [
  {
    id: 'Room 1',
    title: 'Room 1',
    floor: 1,
    minCapacity: 3,
    maxCapacity: 6,
    available: false,
  },
  {
    id: 'Room 2',
    title: 'Room 2',
    floor: 1,
    minCapacity: 3,
    maxCapacity: 6,
    available: true,
  },
  {
    id: 'Room 3',
    title: 'Room 3',
    floor: 1,
    minCapacity: 3,
    maxCapacity: 6,
    available: true,
  },
];
