import * as path from 'path';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

import { UserResolver } from '../resolver/user-resolver';
import { RoomResolver } from '../resolver/room-resolver';
import { EventResolver } from '../resolver/event-resolver';

export function createSchema() {
  return buildSchema({
    resolvers: [UserResolver, RoomResolver, EventResolver],
    container: Container,
    dateScalarMode: 'isoDate',
    emitSchemaFile: {
      path: path.resolve(
        __dirname,
        '..',
        '__snapshots__',
        'schema',
        'schema.gql'
      ),
      commentDescriptions: true,
    },
  });
}
