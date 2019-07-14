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
      login: 'veged',
      avatarUrl: 'https://avatars3.githubusercontent.com/u/15365?s=460&v=4',
      homeFloor: 0,
    },
    {
      login: 'alt-j',
      avatarUrl: 'https://avatars1.githubusercontent.com/u/3763844?s=400&v=4',
      homeFloor: 3,
    },
    {
      login: 'yeti-or',
      avatarUrl: 'https://avatars0.githubusercontent.com/u/1813468?s=460&v=4',
      homeFloor: 2,
    },
  ]);

  await userRepository.save(users);

  const rooms = roomRepository.create([
    {
      title: '404',
      capacity: 5,
      floor: 4,
    },
    {
      title: 'Деньги',
      capacity: 4,
      floor: 2,
    },
    {
      title: 'Карты',
      capacity: 4,
      floor: 2,
    },
    {
      title: 'Ствола',
      capacity: 2,
      floor: 2,
    },
    {
      title: '14',
      capacity: 6,
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
