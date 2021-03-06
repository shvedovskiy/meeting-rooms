import { Connection } from 'typeorm';
import { startOfDay } from 'date-fns';
import faker from 'faker';

import { connectToDatabase } from '../service/create-connection';
import { graphQLCall } from '../test-utils/graphql-call';
import { Event } from '../entity/event';
import { User } from '../entity/user';
import { Room } from '../entity/room';
import { createEvent, createRoom, createUser } from '../test-utils/create-db-entity';

let connection: Connection;

beforeAll(async () => {
  connection = await connectToDatabase({ drop: true });
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
          date
          startTime
          endTime
          room {
            id
            title
            floor
            minCapacity
            maxCapacity
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
      const dbRooms = await createRoom(2);
      const dbUsers = await createUser(6);
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
              date: events[0].date.toISOString(),
              startTime: events[0].startTime,
              endTime: events[0].endTime,
              room: {
                id: dbRooms[0].id,
                title: dbRooms[0].title,
                floor: dbRooms[0].floor,
                minCapacity: dbRooms[0].minCapacity,
                maxCapacity: dbRooms[0].maxCapacity,
              },
            },
            {
              id: events[1].id,
              title: events[1].title,
              date: events[1].date.toISOString(),
              startTime: events[1].startTime,
              endTime: events[1].endTime,
              room: {
                id: dbRooms[1].id,
                title: dbRooms[1].title,
                floor: dbRooms[1].floor,
                minCapacity: dbRooms[1].minCapacity,
                maxCapacity: dbRooms[1].maxCapacity,
              },
            },
          ],
        },
      });
      expect(response!.data!.events[0].users).toIncludeSameMembers(dbUsers.slice(0, 3));
      expect(response!.data!.events[1].users).toIncludeSameMembers(dbUsers.slice(3, 6));
    });

    it('does dot return past events', async () => {
      const eventsIdsQuery = `
        query Events {
          events {
            id
          }
        }
      `;
      const dbRooms = await createRoom(2);
      const dbUsers = await createUser(6);
      const futureEvent = await createEvent(dbRooms[0].id, [
        dbUsers[0],
        dbUsers[1],
        dbUsers[2],
      ]);
      await createEvent(dbRooms[1].id, [dbUsers[3], dbUsers[4], dbUsers[5]], {
        date: startOfDay(faker.date.past()),
      });

      const response = await graphQLCall({
        source: eventsIdsQuery,
      });
      expect(response).toMatchObject({
        data: {
          events: [{ id: futureEvent.id }],
        },
      });
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
          date
          startTime
          endTime
          room {
            id
            title
            floor
            minCapacity
            maxCapacity
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
      dbUsers = await createUser(3);
      dbRoom = await createRoom();
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
            date: dbEvent.date.toISOString(),
            startTime: dbEvent.startTime,
            endTime: dbEvent.endTime,
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
