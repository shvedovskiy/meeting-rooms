import 'reflect-metadata';

import * as path from 'path';
import { useContainer, createConnection } from 'typeorm';
import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server';

import { User } from './entity/user';
import { Room } from './entity/room';
import { Event } from './entity/event';
import { UserResolver } from './resolver/user-resolver';
import { RoomResolver } from './resolver/room-resolver';
import { EventResolver } from './resolver/event-resolver';
import { seedDatabase } from './service/seed-database';
import {
  isDevEnv,
  isTestEnv,
  isProdEnv,
  DATABASE_NAME,
  MOCK_DATABASE,
  PORT,
  NODE_ENV,
} from './service/config';

useContainer(Container);

async function bootstrapServer() {
  try {
    await createConnection({
      type: 'sqlite',
      database: DATABASE_NAME,
      entities: [User, Room, Event],
      logging: isDevEnv ? true : ['error'],
      synchronize: !isProdEnv,
      dropSchema: MOCK_DATABASE === 'true',
    });

    if (MOCK_DATABASE === 'true' || isTestEnv) {
      await seedDatabase();
    }

    const schema = await buildSchema({
      resolvers: [UserResolver, RoomResolver, EventResolver],
      container: Container,
      dateScalarMode: 'isoDate',
      emitSchemaFile: {
        path: path.resolve(__dirname, '__snapshots__', 'schema', 'schema.gql'),
        commentDescriptions: true,
      },
    });
    const server = new ApolloServer({ schema, context: {} });
    const { url } = await server.listen(PORT);
    console.info(`🚀 Server running at ${url} in ${NODE_ENV} mode`);
  } catch (err) {
    console.error(err);
  }
}

bootstrapServer();
