import { Connection } from 'typeorm';
import faker from 'faker';
import addDays from 'date-fns/addDays';

import { connectToDatabase } from '../service/create-connection';
import { graphQLCall } from '../test-utils/graphql-call';
import { createRoom, createUser, createEvent } from '../test-utils/create-db-entity';
import { User } from '../entity/user';
import { Event } from '../entity/event';
import { Room } from '../entity/room';

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

describe('Event Mutation Update', () => {
  describe('updateEvent()::$input', () => {
    const updateEventQuery = `
      mutation UpdateEvent($id: ID!, $input: EventUpdateInput) {
        updateEvent(id: $id, input: $input) {
          id
          title
          date
          startTime
          endTime
          room {
            id
          }
          users {
            id
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

    it('updates event data', async () => {
      const updateData = {
        title: faker.random.word(),
        date: addDays(dbEvent.date, 1),
        startTime: '15:00',
        endTime: '17:15',
      };

      const response = await graphQLCall({
        source: updateEventQuery,
        variableValues: {
          id: dbEvent.id,
          input: updateData,
        },
      });
      const userIds = [{ id: dbUsers[0].id }, { id: dbUsers[1].id }, { id: dbUsers[2].id }];

      expect(response).toMatchObject({
        data: {
          updateEvent: {
            id: dbEvent.id,
            title: updateData.title,
            date: updateData.date.toISOString(),
            startTime: updateData.startTime,
            endTime: updateData.endTime,
            room: {
              id: dbRoom.id,
            },
          },
        },
      });
      expect(response!.data!.updateEvent.users).toIncludeAllMembers(userIds);
    });

    it('updates part of event data', async () => {
      const updateData = {
        date: addDays(dbEvent.date, 1),
      };

      const response = await graphQLCall({
        source: updateEventQuery,
        variableValues: {
          id: dbEvent.id,
          input: updateData,
        },
      });
      const userIds = [{ id: dbUsers[0].id }, { id: dbUsers[1].id }, { id: dbUsers[2].id }];

      expect(response).toMatchObject({
        data: {
          updateEvent: {
            id: dbEvent.id,
            title: dbEvent.title,
            date: updateData.date.toISOString(),
            startTime: dbEvent.startTime,
            endTime: dbEvent.endTime,
            room: {
              id: dbRoom.id,
            },
          },
        },
      });
      expect(response!.data!.updateEvent.users).toIncludeAllMembers(userIds);
    });

    it('does not update the event when passing extra properties', async () => {
      const updateData = {
        title: faker.random.word(),
        date: addDays(dbEvent.date, 1),
        startTime: '15:00',
        endTime: '17:15',
        extra: true,
      };

      const response = await graphQLCall({
        source: updateEventQuery,
        variableValues: {
          id: dbEvent.id,
          input: updateData,
        },
      });
      const dbEventAfterQuery = await Event.findOne(dbEvent.id);

      expect(dbEventAfterQuery!.title).not.toBe(updateData.title);
      expect(response.data).toEqual(undefined);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not update unknown event', async () => {
      const updateData = {
        title: faker.random.word(),
        date: addDays(dbEvent.date, 1),
        startTime: '15:00',
        endTime: '17:15',
      };

      const response = await graphQLCall({
        source: updateEventQuery,
        variableValues: {
          id: dbEvent.id + '__unknown__',
          input: updateData,
        },
      });
      const dbEventAfterQuery = await Event.findOne(dbEvent.id);

      expect(dbEventAfterQuery!.title).not.toBe(updateData.title);
      expect(response.data).toEqual({ updateEvent: null });
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });
  });

  describe('updateEvent()::$roomId', () => {
    const updateEventQuery = `
      mutation UpdateEvent($id: ID!, $roomId: ID) {
        updateEvent(id: $id, roomId: $roomId) {
          id
          room {
            id
            title
          }
        }
      }
    `;
    let dbRoom: Room;
    let dbEvent: Event;

    beforeEach(async () => {
      dbRoom = await createRoom();
      dbEvent = await createEvent(dbRoom.id);
    });

    it('changes event room', async () => {
      const newDbRoom = await createRoom();

      const response = await graphQLCall({
        source: updateEventQuery,
        variableValues: {
          id: dbEvent.id,
          roomId: newDbRoom.id,
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);

      expect(response).toMatchObject({
        data: {
          updateEvent: {
            id: dbEvent.id,
            room: {
              id: newDbRoom.id,
              title: newDbRoom.title,
            },
          },
        },
      });
      expect(dbEventAfterUpdate!.roomId).toBe(newDbRoom.id);
    });

    it('does not change event room to the same', async () => {
      const response = await graphQLCall({
        source: updateEventQuery,
        variableValues: {
          id: dbEvent.id,
          roomId: dbRoom.id,
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);

      expect(dbEventAfterUpdate!.roomId).toBe(dbRoom.id);
      expect(response.data!.updateEvent).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not change event room to the unknown', async () => {
      const response = await graphQLCall({
        source: updateEventQuery,
        variableValues: {
          id: dbEvent.id,
          roomId: dbRoom.id + '__unknown__',
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);

      expect(dbEventAfterUpdate!.roomId).toBe(dbRoom.id);
      expect(response.data!.updateEvent).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });
  });

  describe('updateEvent()::$userIds', () => {
    const updateEventQuery = `
      mutation UpdateEvent($id: ID!, $userIds: [ID!]) {
        updateEvent(id: $id, userIds: $userIds) {
          id
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
      dbUsers = await createUser(2);
      dbRoom = await createRoom();
      dbEvent = await createEvent(dbRoom.id, dbUsers);
    });

    it('changes event users list', async () => {
      const newDbUsers = await createUser(2);

      const response = await graphQLCall({
        source: updateEventQuery,
        variableValues: {
          id: dbEvent.id,
          userIds: [newDbUsers[0].id, newDbUsers[1].id],
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;

      expect(response).toMatchObject({
        data: {
          updateEvent: {
            id: dbEvent.id,
          },
        },
      });
      expect(response!.data!.updateEvent.users).toIncludeSameMembers([...newDbUsers]);
      expect(dbEventUsers.find(u => u.id === newDbUsers[0].id)).toBeDefined();
      expect(dbEventUsers.find(u => u.id === newDbUsers[1].id)).toBeDefined();
    });

    it('removes all users from list', async () => {
      const response = await graphQLCall({
        source: updateEventQuery,
        variableValues: {
          id: dbEvent.id,
          userIds: [],
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;

      expect(response).toMatchObject({
        data: {
          updateEvent: {
            id: dbEvent.id,
          },
        },
      });
      expect(response!.data!.updateEvent.users).toEqual([]);
      expect(dbEventUsers).toEqual([]);
    });
  });

  describe('updateEvents()', () => {
    const updateEventsQuery = `
      mutation UpdateEvents($events: [UpdateInput!]!) {
        updateEvents(events: $events) {
          id
          title
          date
          startTime
          endTime
          room {
            id
          }
          users {
            id
          }
        }
      }
    `;
    let dbUsers: User[];
    let dbRooms: Room[];
    let dbEvent1: Event;
    let dbEvent2: Event;

    beforeEach(async () => {
      dbUsers = await createUser(4);
      dbRooms = await createRoom(2);
      dbEvent1 = await createEvent(dbRooms[0].id, dbUsers.slice(0, 2));
      dbEvent2 = await createEvent(dbRooms[1].id, dbUsers.slice(2));
    });
    it('updates multiple events', async () => {
      const [newDbRoom1, newDbRoom2] = await createRoom(2);
      const newDbUsers = await createUser(4);
      const updateData = [
        {
          id: dbEvent1.id,
          input: {
            title: faker.random.word(),
            date: addDays(dbEvent1.date, 1),
            startTime: '15:00',
            endTime: '17:15',
          },
          roomId: newDbRoom1.id,
          userIds: [newDbUsers[0].id, newDbUsers[1].id],
        },
        {
          id: dbEvent2.id,
          input: {
            title: faker.random.word(),
            date: addDays(dbEvent2.date, 1),
            startTime: '21:00',
            endTime: '22:45',
          },
          roomId: newDbRoom2.id,
          userIds: [newDbUsers[2].id, newDbUsers[3].id],
        },
      ];

      const response = await graphQLCall({
        source: updateEventsQuery,
        variableValues: {
          events: updateData,
        },
      });
      const dbEventAfterUpdate1 = await Event.findOne(dbEvent1.id);
      const dbEventAfterUpdate2 = await Event.findOne(dbEvent2.id);
      const dbEvent1Users = await dbEventAfterUpdate1!.users;
      const dbEvent2Users = await dbEventAfterUpdate2!.users;

      expect(response).toMatchObject({
        data: {
          updateEvents: [
            {
              id: dbEvent1.id,
              title: updateData[0].input.title,
              date: updateData[0].input.date.toISOString(),
              startTime: updateData[0].input.startTime,
              endTime: updateData[0].input.endTime,
              room: {
                id: newDbRoom1.id,
              },
            },
            {
              id: dbEvent2.id,
              title: updateData[1].input.title,
              date: updateData[1].input.date.toISOString(),
              startTime: updateData[1].input.startTime,
              endTime: updateData[1].input.endTime,
              room: {
                id: newDbRoom2.id,
              },
            },
          ],
        },
      });
      expect(response!.data!.updateEvents![0].users).toIncludeSameMembers([
        { id: newDbUsers[0].id },
        { id: newDbUsers[1].id },
      ]);
      expect(response!.data!.updateEvents![1].users).toIncludeSameMembers([
        { id: newDbUsers[2].id },
        { id: newDbUsers[3].id },
      ]);
      expect(dbEventAfterUpdate1!.roomId).toBe(newDbRoom1.id);
      expect(dbEventAfterUpdate2!.roomId).toBe(newDbRoom2.id);
      expect(dbEvent1Users.find(u => u.id === newDbUsers[0].id)).toBeDefined();
      expect(dbEvent1Users.find(u => u.id === newDbUsers[1].id)).toBeDefined();
      expect(dbEvent2Users.find(u => u.id === newDbUsers[2].id)).toBeDefined();
      expect(dbEvent2Users.find(u => u.id === newDbUsers[3].id)).toBeDefined();
    });

    it("cancels update of all events if at least one update isn't successful", async () => {
      const [newDbRoom1, newDbRoom2] = await createRoom(2);
      const newDbUsers = await createUser(4);
      const updateData = [
        {
          id: dbEvent1.id,
          input: {
            title: faker.random.word(),
            date: addDays(dbEvent1.date, 1),
            startTime: '15:00',
            endTime: '17:15',
          },
          roomId: newDbRoom1.id,
          userIds: [newDbUsers[0].id, newDbUsers[1].id],
        },
        {
          id: '__unknown__',
          input: {
            title: faker.random.word(),
            date: addDays(dbEvent2.date, 1),
            startTime: '21:00',
            endTime: '22:45',
          },
          roomId: newDbRoom2.id,
          userIds: [newDbUsers[2].id, newDbUsers[3].id],
        },
      ];

      const response = await graphQLCall({
        source: updateEventsQuery,
        variableValues: {
          events: updateData,
        },
      });
      const dbEventAfterUpdate1 = await Event.findOne(dbEvent1.id);
      const dbEventAfterUpdate2 = await Event.findOne(dbEvent2.id);
      const dbEvent1Users = await dbEventAfterUpdate1!.users!;
      const dbEvent2Users = await dbEventAfterUpdate2!.users;

      expect(dbEventAfterUpdate1!.title).not.toBe(updateData[0].input.title);
      expect(dbEventAfterUpdate2!.title).not.toBe(updateData[1].input.title);
      expect(dbEventAfterUpdate1!.roomId).toBe(dbRooms[0].id);
      expect(dbEventAfterUpdate2!.roomId).toBe(dbRooms[1].id);
      expect(dbEvent1Users).not.toIncludeSameMembers([...newDbUsers.slice(0, 2)]);
      expect(dbEvent2Users).not.toIncludeSameMembers([...newDbUsers.slice(2)]);
      expect(response.data).toEqual({ updateEvents: null });
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });
  });
});
