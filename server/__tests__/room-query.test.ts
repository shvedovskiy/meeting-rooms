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
          minCapacity
          maxCapacity
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
              minCapacity: rooms[0].minCapacity,
              maxCapacity: rooms[0].maxCapacity,
              floor: rooms[0].floor,
            },
            {
              id: rooms[1].id,
              title: rooms[1].title,
              minCapacity: rooms[1].minCapacity,
              maxCapacity: rooms[1].maxCapacity,
              floor: rooms[1].floor,
            },
            {
              id: rooms[2].id,
              minCapacity: rooms[2].minCapacity,
              maxCapacity: rooms[2].maxCapacity,
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
          minCapacity
          maxCapacity
          floor
          events {
            id
            title
            date
            startTime
            endTime
          }
        }
      }
    `;
    let dbRoom: Room;

    beforeEach(async () => {
      dbRoom = await createRoom();
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
            minCapacity: dbRoom.minCapacity,
            maxCapacity: dbRoom.maxCapacity,
            floor: dbRoom.floor,
          },
        },
      });
      expect(response!.data!.room.events).toIncludeSameMembers([
        {
          id: roomEvent.id,
          title: roomEvent.title,
          date: roomEvent.date.toISOString(),
          startTime: roomEvent.startTime,
          endTime: roomEvent.endTime,
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
