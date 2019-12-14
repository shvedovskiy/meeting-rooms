import { getRepository } from 'typeorm';
import startOfDay from 'date-fns/startOfDay';
import format from 'date-fns/format';
import addHours from 'date-fns/addHours';
import ruLocale from 'date-fns/locale/ru';

import { User } from '../entity/user';
import { Room } from '../entity/room';
import { Event } from '../entity/event';

export async function seedDatabase() {
  const now = new Date();
  const today = startOfDay(now);
  const rightNow = format(now, 'HH:mm', { locale: ruLocale });
  const oneHourLater = format(addHours(now, 1), 'HH:mm', { locale: ruLocale });
  const twoHoursLater = format(addHours(now, 2), 'HH:mm', { locale: ruLocale });
  const threeHoursLater = format(addHours(now, 3), 'HH:mm', {
    locale: ruLocale,
  });

  const userRepository = getRepository(User);
  const roomRepository = getRepository(Room);
  const eventRepository = getRepository(Event);

  const users = userRepository.create([
    {
      login: 'Vaughn Ziemann',
      avatarUrl: '/avatars/4d/4db2525d-649e-4a74-baf4-ec820d7f797c',
      homeFloor: 2,
    },
    {
      login: 'Imelda Walter',
      avatarUrl: '/avatars/43/4317f88f-67c9-40df-956c-2c6abd1ecd45',
      homeFloor: 2,
    },
    {
      login: 'Gregory Lakin',
      avatarUrl: '/avatars/11/11b0dafc-80cd-485e-9e7e-557943380554',
      homeFloor: 3,
    },
    {
      login: 'Hardy Denesik',
      avatarUrl: '/avatars/5e/5e926f68-7e6f-45ae-aea1-b891bf018c05',
      homeFloor: 6,
    },
    {
      login: 'Jennings Feest',
      avatarUrl: '/avatars/1c/1c930d7a-9f21-47d7-87f9-95f751b93b1f',
      homeFloor: 8,
    },
    {
      login: 'Miles Bartoletti',
      avatarUrl: '/avatars/99/99125a8e-376e-46ac-8773-1e0b50dc47d1',
      homeFloor: 4,
    },
    {
      login: 'Dejah Reilly',
      avatarUrl: '/avatars/fd/fdf56b93-e47a-4473-8d44-caf0b37f07e7',
      homeFloor: 6,
    },
    {
      login: 'Tevin Adams',
      avatarUrl: '/avatars/a9/a9c67262-ddcc-4511-964e-d72700937625',
      homeFloor: 1,
    },
    {
      login: 'Durward Schroeder',
      avatarUrl: '/avatars/60/600f9be2-1c76-4f56-9d60-d04c9b0e6fdb',
      homeFloor: 2,
    },
    {
      login: 'Connie Kling',
      avatarUrl: '/avatars/17/17904c5f-f3c4-4dbb-88af-491dd209767d',
      homeFloor: 4,
    },
  ]);

  await userRepository.save(users);

  const rooms = roomRepository.create([
    {
      title: 'North Theo',
      minCapacity: 10,
      maxCapacity: 14,
      floor: 2,
    },
    {
      title: 'Feestside',
      minCapacity: 1,
      maxCapacity: 2,
      floor: 1,
    },
    {
      title: 'New Wilton',
      minCapacity: 1,
      maxCapacity: 18,
      floor: 5,
    },
    {
      title: 'Richardshire',
      minCapacity: 1,
      maxCapacity: 4,
      floor: 5,
    },
    {
      title: 'West Roxanne',
      minCapacity: 1,
      maxCapacity: 8,
      floor: 3,
    },
    {
      title: 'Kodymouth',
      minCapacity: 3,
      maxCapacity: 12,
      floor: 4,
    },
    {
      title: 'Corwinstad',
      minCapacity: 1,
      maxCapacity: 10,
      floor: 9,
    },
    {
      title: 'Port Moniqueberg',
      minCapacity: 1,
      maxCapacity: 10,
      floor: 1,
    },
    {
      title: 'New Marquise',
      minCapacity: 3,
      maxCapacity: 12,
      floor: 6,
    },
    {
      title: 'Dietrichtown',
      minCapacity: 1,
      maxCapacity: 8,
      floor: 3,
    },
  ]);
  await roomRepository.save(rooms);

  const events = eventRepository.create([
    {
      title: 'ШРИ 2018 - начало',
      date: today,
      startTime: rightNow,
      endTime: oneHourLater,
    },
    {
      title: '👾 Хакатон 👾',
      date: today,
      startTime: oneHourLater,
      endTime: twoHoursLater,
    },
    {
      title: '🍨 Пробуем kefir.js',
      date: today,
      startTime: twoHoursLater,
      endTime: threeHoursLater,
    },
  ]);
  events[0].room = Promise.resolve(rooms[0]);
  events[0].users = Promise.resolve([users[0], users[1]]);

  events[1].room = Promise.resolve(rooms[1]);
  events[1].users = Promise.resolve([users[1], users[2]]);

  events[2].room = Promise.resolve(rooms[2]);
  events[2].users = Promise.resolve([users[0], users[2]]);
  await eventRepository.save(events);
}
