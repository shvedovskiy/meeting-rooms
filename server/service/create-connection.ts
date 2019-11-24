import { createConnection } from 'typeorm';
import { useContainer } from 'typeorm';
import { Container } from 'typedi';

import { User } from '../entity/user';
import { Room } from '../entity/room';
import { Event } from '../entity/event';
import { seedDatabase } from './seed-database';
import { DATABASE_NAME } from './config';

export async function connectToDatabase(prod = false, drop = false) {
  useContainer(Container);

  const connection = await createConnection({
    name: 'default',
    type: 'sqlite',
    database: DATABASE_NAME,
    entities: [User, Room, Event],
    logging: !prod,
    synchronize: drop,
    dropSchema: drop,
  });

  if (!prod) {
    await seedDatabase();
  }

  return connection;
}
