import faker from 'faker';

import { User } from '../entity/user';
import { Room } from '../entity/room';
import { Event } from '../entity/event';

export function createUser(): Promise<User>;
export function createUser(quantity: number): Promise<User[]>;
export async function createUser(quantity: number = 1): Promise<User | User[]> {
  if (quantity > 1) {
    const usersData: User[] = [];
    for (let i = 0; i !== quantity; i++) {
      usersData[i] = User.create({
        login: faker.internet.userName(),
        homeFloor: faker.random.number({ max: 254 }),
        avatarUrl: faker.image.avatar(),
      });
    }
    return User.save(usersData);
  } else {
    return User.create({
      login: faker.internet.userName(),
      homeFloor: faker.random.number({ max: 254 }),
      avatarUrl: faker.image.avatar(),
    }).save();
  }
}

export function createRoom(): Promise<Room>;
export function createRoom(quantity: number): Promise<Room[]>;
export async function createRoom(quantity: number = 1): Promise<Room | Room[]> {
  if (quantity > 1) {
    const roomsData: Room[] = [];
    for (let i = 0; i !== quantity; i++) {
      roomsData[i] = Room.create({
        title: faker.random.word(),
        capacity: faker.random.number({ max: 31999 }),
        floor: faker.random.number({ max: 254 }),
      });
    }
    return Room.save(roomsData);
  } else {
    return Room.create({
      title: faker.random.word(),
      capacity: faker.random.number({ max: 31999 }),
      floor: faker.random.number({ max: 254 }),
    }).save();
  }
}

export async function createEvent(roomId: string, users: User[] = []) {
  const event = Event.create({
    title: faker.random.word(),
    dateStart: faker.date.past(),
    dateEnd: faker.date.future(),
  });

  event.roomId = roomId;
  event.users = Promise.resolve(users);

  return event.save();
}
