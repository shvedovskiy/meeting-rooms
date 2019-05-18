import { Connection } from 'typeorm';

import { connectToDatabase } from '../service/create-connection';
import { graphQLCall } from '../test-utils/graphql-call';
import { Room } from '../entity/room';
import { createRoom, createEvent } from '../test-utils/create-db-entity';

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
      await createRoom(3);
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
          events {
            id
            title
            dateStart
            dateEnd
          }
        }
      }
    `;
    let dbRoom: Room;

    beforeEach(async () => {
      dbRoom = (await createRoom()) as Room;
    });

    it('returns room data corresponding to the passed id', async () => {
      const roomEvent = await createEvent(dbRoom.id);

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
      expect(response!.data!.room.events).toIncludeSameMembers([
        {
          id: roomEvent.id,
          title: roomEvent.title,
          dateStart: roomEvent.dateStart.toISOString(),
          dateEnd: roomEvent.dateEnd.toISOString(),
        },
      ]);
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
