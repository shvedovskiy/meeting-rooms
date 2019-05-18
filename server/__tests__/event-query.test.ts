import { Connection } from 'typeorm';

import { connectToDatabase } from '../service/create-connection';
import { graphQLCall } from '../test-utils/graphql-call';
import { Event } from '../entity/event';
import { User } from '../entity/user';
import { Room } from '../entity/room';
import {
  createEvent,
  createRoom,
  createUser,
} from '../test-utils/create-db-entity';

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

describe('Event Query', () => {
  describe('events()', () => {
    const eventsQuery = `
      query Events {
        events {
          id
          title
          dateStart
          dateEnd
          room {
            id
            title
            floor
            capacity
          }
          users {
            id
            login
            homeFloor
            avatarUrl
          }
        }
      }
    `;

    it('returns list of events', async () => {
      const dbRooms = (await createRoom(2)) as Room[];
      const dbUsers = (await createUser(6)) as User[];
      await createEvent(dbRooms[0].id, [dbUsers[0], dbUsers[1], dbUsers[2]]);
      await createEvent(dbRooms[1].id, [dbUsers[3], dbUsers[4], dbUsers[5]]);
      const events = await Event.find();

      const response = await graphQLCall({
        source: eventsQuery,
      });

      expect(response).toMatchObject({
        data: {
          events: [
            {
              id: events[0].id,
              title: events[0].title,
              dateStart: events[0].dateStart.toISOString(),
              dateEnd: events[0].dateEnd.toISOString(),
              room: {
                id: dbRooms[0].id,
                title: dbRooms[0].title,
                floor: dbRooms[0].floor,
                capacity: dbRooms[0].capacity,
              },
            },
            {
              id: events[1].id,
              title: events[1].title,
              dateStart: events[1].dateStart.toISOString(),
              dateEnd: events[1].dateEnd.toISOString(),
              room: {
                id: dbRooms[1].id,
                title: dbRooms[1].title,
                floor: dbRooms[1].floor,
                capacity: dbRooms[1].capacity,
              },
            },
          ],
        },
      });
      expect(response!.data!.events[0].users).toIncludeSameMembers(
        dbUsers.slice(0, 3)
      );
      expect(response!.data!.events[1].users).toIncludeSameMembers(
        dbUsers.slice(3, 6)
      );
    });

    it('returns empty list if there are no events', async () => {
      const response = await graphQLCall({
        source: eventsQuery,
      });

      expect(response).toMatchObject({
        data: {
          events: [],
        },
      });
    });
  });

  describe('event()', () => {
    const eventQuery = `
      query Event($id: ID!) {
        event(id: $id) {
          id
          title
          dateStart
          dateEnd
          room {
            id
            title
            floor
            capacity
          }
          users {
            id
            login
            homeFloor
            avatarUrl
          }
        }
      }
    `;
    let dbUsers: User[];
    let dbRoom: Room;
    let dbEvent: Event;

    beforeEach(async () => {
      dbUsers = (await createUser(3)) as User[];
      dbRoom = (await createRoom()) as Room;
      dbEvent = await createEvent(dbRoom.id, dbUsers);
    });

    it('returns event data corresponding to the passed id', async () => {
      const response = await graphQLCall({
        source: eventQuery,
        variableValues: {
          id: dbEvent.id,
        },
      });

      expect(response).toMatchObject({
        data: {
          event: {
            id: dbEvent.id,
            title: dbEvent.title,
            dateStart: dbEvent.dateStart.toISOString(),
            dateEnd: dbEvent.dateEnd.toISOString(),
          },
        },
      });
      expect(response!.data!.event.room).toMatchObject(dbRoom);
      expect(response!.data!.event.users).toIncludeSameMembers(dbUsers);
    });

    it('returns nothing for unknown id', async () => {
      const response = await graphQLCall({
        source: eventQuery,
        variableValues: {
          id: dbEvent.id + '__unknown__',
        },
      });

      expect(response).toMatchObject({
        data: {
          event: null,
        },
      });
    });
  });
});
