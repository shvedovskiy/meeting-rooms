/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Connection } from 'typeorm';
import faker from 'faker';

import { connectToDatabase } from '../service/create-connection';
import { graphQLCall } from '../test-utils/graphql-call';
import { Room } from '../entity/room';

let connection: Connection;

beforeAll(async () => {
  connection = await connectToDatabase();
});

afterAll(async () => {
  await connection.close();
});

afterEach(async () => {
  await connection.synchronize(true);
});

describe('Room Query', () => {
  describe('rooms()', () => {
    const roomsQuery = `
      query Rooms {
        rooms {
          id
          title
          capacity
          floor
        }
      }
    `;
    it('returns list of rooms', async () => {
      await Room.insert([
        {
          title: faker.random.word(),
          capacity: faker.random.number({ max: 32000 }),
          floor: faker.random.number({ max: 255 }),
        },
        {
          title: faker.random.word(),
          capacity: faker.random.number({ max: 32000 }),
          floor: faker.random.number({ max: 255 }),
        },
        {
          title: faker.random.word(),
          capacity: faker.random.number({ max: 32000 }),
          floor: faker.random.number({ max: 255 }),
        },
      ]);
      const rooms = await Room.find();

      const response = await graphQLCall({
        source: roomsQuery,
      });

      expect(response).toMatchObject({
        data: {
          rooms: [
            {
              id: rooms[0].id,
              title: rooms[0].title,
              capacity: rooms[0].capacity,
              floor: rooms[0].floor,
            },
            {
              id: rooms[1].id,
              title: rooms[1].title,
              capacity: rooms[1].capacity,
              floor: rooms[1].floor,
            },
            {
              id: rooms[2].id,
              title: rooms[2].title,
              capacity: rooms[2].capacity,
              floor: rooms[2].floor,
            },
          ],
        },
      });
    });

    it('returns empty list if there are no rooms', async () => {
      const response = await graphQLCall({
        source: roomsQuery,
      });

      expect(response).toMatchObject({
        data: {
          rooms: [],
        },
      });
    });
  });

  describe('room()', () => {
    const roomQuery = `
      query Room($id: ID!) {
        room(id: $id) {
          id
          title
          capacity
          floor
        }
      }
    `;
    let dbRoom: Room;

    beforeEach(async () => {
      dbRoom = await Room.create({
        title: faker.random.word(),
        capacity: faker.random.number({ max: 32000 }),
        floor: faker.random.number({ max: 255 }),
      }).save();
    });

    it('returns room data corresponding to the passed id', async () => {
      const response = await graphQLCall({
        source: roomQuery,
        variableValues: {
          id: dbRoom.id,
        },
      });

      expect(response).toMatchObject({
        data: {
          room: {
            id: dbRoom.id,
            title: dbRoom.title,
            capacity: dbRoom.capacity,
            floor: dbRoom.floor,
          },
        },
      });
    });

    it('returns nothing for unknown id', async () => {
      const response = await graphQLCall({
        source: roomQuery,
        variableValues: {
          id: dbRoom.id + '__unknown__',
        },
      });

      expect(response).toMatchObject({
        data: {
          room: null,
        },
      });
    });
  });
});
