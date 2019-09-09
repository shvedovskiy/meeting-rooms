import { Connection } from 'typeorm';
import faker from 'faker';
import startOfDay from 'date-fns/startOfDay';
import addDays from 'date-fns/addDays';

import { connectToDatabase } from '../service/create-connection';
import { graphQLCall } from '../test-utils/graphql-call';
import {
  createRoom,
  createUser,
  createEvent,
} from '../test-utils/create-db-entity';
import { User } from '../entity/user';
import { Event } from '../entity/event';
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

describe('Event Mutation', () => {
  describe('createEvent()', () => {
    const createEventQuery = `
      mutation CreateEvent($input: EventInput!, $roomId: ID!, $userIds: [ID!]) {
        createEvent(input: $input, roomId: $roomId, userIds: $userIds) {
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

    beforeEach(async () => {
      dbUsers = await createUser(3);
      dbRoom = await createRoom();
    });

    it('creates an event with specified properties', async () => {
      const newEventData = {
        title: faker.random.word(),
        date: startOfDay(faker.date.future()),
        startTime: '17:30',
        endTime: '18:15',
      };

      const response = await graphQLCall({
        source: createEventQuery,
        variableValues: {
          input: newEventData,
          roomId: dbRoom.id,
          userIds: dbUsers.map(user => user.id),
        },
      });
      const dbEvent = await Event.findOne({
        where: { title: newEventData.title },
      });

      expect(dbEvent).toBeDefined();
      expect(response).toMatchObject({
        data: {
          createEvent: {
            id: dbEvent!.id,
            title: newEventData.title,
            date: newEventData.date.toISOString(),
            startTime: newEventData.startTime,
            endTime: newEventData.endTime,
            room: {
              id: dbRoom.id,
            },
            users: [
              { id: dbUsers[0].id },
              { id: dbUsers[1].id },
              { id: dbUsers[2].id },
            ],
          },
        },
      });
    });

    it('does not create an event without specified title', async () => {
      const newEventData = {
        date: startOfDay(faker.date.future()),
        startTime: '10:30',
        endTime: '12:00',
      };

      const response = await graphQLCall({
        source: createEventQuery,
        variableValues: {
          input: newEventData,
          roomId: dbRoom.id,
          userIds: dbUsers.map(user => user.id),
        },
      });
      const dbEvents = await Event.find();

      expect(dbEvents).toHaveLength(0);
      expect(response.data).toEqual(undefined);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not create an event without specified dates', async () => {
      const newEventData = {
        title: faker.random.word(),
      };

      const response = await graphQLCall({
        source: createEventQuery,
        variableValues: {
          input: newEventData,
          roomId: dbRoom.id,
          userIds: dbUsers.map(user => user.id),
        },
      });
      const dbEvents = await Event.find();

      expect(dbEvents).toHaveLength(0);
      expect(response.data).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not create an event without specified room', async () => {
      const eventQuery = `
        mutation CreateEvent($input: EventInput!, $userIds: [ID!]) {
          createEvent(input: $input, userIds: $userIds) {
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
      const newEventData = {
        title: faker.random.word(),
        date: startOfDay(faker.date.future()),
        startTime: '08:00',
        endTime: '09:15',
      };

      const response = await graphQLCall({
        source: eventQuery,
        variableValues: {
          input: newEventData,
          userIds: dbUsers.map(user => user.id),
        },
      });
      const dbEvents = await Event.find();

      expect(dbEvents).toHaveLength(0);
      expect(response.data).toEqual(undefined);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not create an event with unknown room', async () => {
      const newEventData = {
        title: faker.random.word(),
        date: startOfDay(faker.date.future()),
        startTime: '08:00',
        endTime: '09:15',
      };

      const response = await graphQLCall({
        source: createEventQuery,
        variableValues: {
          input: newEventData,
          roomId: dbRoom.id + '__unknown__',
          userIds: dbUsers.map(user => user.id),
        },
      });
      const dbEvents = await Event.find();

      expect(dbEvents).toHaveLength(0);
      expect(response.data).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('creates an event even without specified users', async () => {
      const eventQuery = `
        mutation CreateEvent($input: EventInput!, $roomId: ID!) {
          createEvent(input: $input, roomId: $roomId) {
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
      const newEventData = {
        title: faker.random.word(),
        date: startOfDay(faker.date.future()),
        startTime: '08:00',
        endTime: '09:15',
      };

      const response = await graphQLCall({
        source: eventQuery,
        variableValues: {
          input: newEventData,
          roomId: dbRoom.id,
        },
      });
      const dbEvent = await Event.findOne({
        where: { title: newEventData.title },
      });

      expect(dbEvent).toBeDefined();
      expect(response).toMatchObject({
        data: {
          createEvent: {
            id: dbEvent!.id,
            title: newEventData.title,
            date: newEventData.date.toISOString(),
            startTime: newEventData.startTime,
            endTime: newEventData.endTime,
            room: {
              id: dbRoom.id,
            },
            users: [],
          },
        },
      });
    });

    it('creates an event without unknown users', async () => {
      const newEventData = {
        title: faker.random.word(),
        date: startOfDay(faker.date.future()),
        startTime: '08:00',
        endTime: '09:15',
      };

      const response = await graphQLCall({
        source: createEventQuery,
        variableValues: {
          input: newEventData,
          roomId: dbRoom.id,
          userIds: [
            dbUsers[0].id,
            dbUsers[1].id + '__unknown__',
            dbUsers[2].id,
          ],
        },
      });
      const dbEvent = await Event.findOne({
        where: { title: newEventData.title },
      });

      expect(dbEvent).toBeDefined();
      expect(response).toMatchObject({
        data: {
          createEvent: {
            id: dbEvent!.id,
            title: newEventData.title,
            date: newEventData.date.toISOString(),
            startTime: newEventData.startTime,
            endTime: newEventData.endTime,
            room: {
              id: dbRoom.id,
            },
            users: [{ id: dbUsers[0].id }, { id: dbUsers[2].id }],
          },
        },
      });
    });

    it('does not create an event with duplicate title', async () => {
      const commonTitle = faker.random.word();
      const firstEventData = {
        title: commonTitle,
        date: startOfDay(faker.date.future()),
        startTime: '08:00',
        endTime: '09:15',
      };
      const secondEventData = {
        title: commonTitle,
        date: startOfDay(faker.date.future()),
        startTime: '16:50',
        endTime: '19:00',
      };

      await graphQLCall({
        source: createEventQuery,
        variableValues: {
          input: firstEventData,
          roomId: dbRoom.id,
          userIds: dbUsers.map(user => user.id),
        },
      });
      const response = await graphQLCall({
        source: createEventQuery,
        variableValues: {
          input: secondEventData,
          roomId: dbRoom.id,
          userIds: dbUsers.map(user => user.id),
        },
      });
      const dbEvents = await Event.find();

      expect(dbEvents).toHaveLength(1);
      expect(dbEvents[0].title).toBe(firstEventData.title);
      expect(response.data).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });
  });

  describe('updateEvent()::$input', () => {
    const updateEventQuery = `
      mutation UpdateEvent($id: ID!, $input: UpdateEventInput) {
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
      const userIds = [
        { id: dbUsers[0].id },
        { id: dbUsers[1].id },
        { id: dbUsers[2].id },
      ];

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
      const userIds = [
        { id: dbUsers[0].id },
        { id: dbUsers[1].id },
        { id: dbUsers[2].id },
      ];

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
      expect(response!.data!.updateEvent.users).toIncludeSameMembers([
        ...newDbUsers,
      ]);
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

  describe('changeEventRoom()', () => {
    const changeEventRoomQuery = `
      mutation ChangeEventRoom($id: ID!, $roomId: String!) {
        changeEventRoom(id: $id, roomId: $roomId) {
          id
          title
          date
          startTime
          endTime
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
        source: changeEventRoomQuery,
        variableValues: {
          id: dbEvent.id,
          roomId: newDbRoom.id,
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);

      expect(response).toMatchObject({
        data: {
          changeEventRoom: {
            id: dbEvent.id,
            title: dbEvent.title,
            date: dbEvent.date.toISOString(),
            startTime: dbEvent.startTime,
            endTime: dbEvent.endTime,
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
        source: changeEventRoomQuery,
        variableValues: {
          id: dbEvent.id,
          roomId: dbRoom.id,
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);

      expect(dbEventAfterUpdate!.roomId).toBe(dbRoom.id);
      expect(response.data!.changeEventRoom).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not change event room to the unknown', async () => {
      const response = await graphQLCall({
        source: changeEventRoomQuery,
        variableValues: {
          id: dbEvent.id,
          roomId: dbRoom.id + '__unknown__',
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);

      expect(dbEventAfterUpdate!.roomId).toBe(dbRoom.id);
      expect(response.data!.changeEventRoom).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });
  });

  describe('addUsersToEvent()', () => {
    const addUsersToEventQuery = `
      mutation AddUsersToEvent($id: ID!, $userIds: [String!]!) {
        addUsersToEvent(id: $id, userIds: $userIds) {
          id
          title
          date
          startTime
          endTime
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

    it('adds new user to event', async () => {
      const newDbUsers = await createUser(2);

      const response = await graphQLCall({
        source: addUsersToEventQuery,
        variableValues: {
          id: dbEvent.id,
          userIds: [newDbUsers[0].id, newDbUsers[1].id],
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;

      expect(response).toMatchObject({
        data: {
          addUsersToEvent: {
            id: dbEvent.id,
            title: dbEvent.title,
            date: dbEvent.date.toISOString(),
            startTime: dbEvent.startTime,
            endTime: dbEvent.endTime,
          },
        },
      });
      expect(response!.data!.addUsersToEvent.users).toIncludeSameMembers([
        ...dbUsers,
        ...newDbUsers,
      ]);
      expect(dbEventUsers.find(u => u.id === newDbUsers[0].id)).toBeDefined();
      expect(dbEventUsers.find(u => u.id === newDbUsers[1].id)).toBeDefined();
    });

    it('does not add existing user to event', async () => {
      const response = await graphQLCall({
        source: addUsersToEventQuery,
        variableValues: {
          id: dbEvent.id,
          userIds: [dbUsers[0].id],
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;

      expect(dbEventUsers).toIncludeSameMembers(dbUsers);
      expect(response.data!.addUsersToEvent).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not add unknown user to event', async () => {
      const response = await graphQLCall({
        source: addUsersToEventQuery,
        variableValues: {
          id: dbEvent.id,
          userIds: [dbUsers[0].id + '__unknown__'],
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;

      expect(dbEventUsers).not.toContain({ id: dbUsers[0].id + '__unknown__' });
      expect(response.data!.addUsersToEvent).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });
  });

  describe('removeUsersFromEvent()', () => {
    const removeUsersFromEventQuery = `
      mutation RemoveUsersFromEvent($id: ID!, $userIds: [String!]!) {
        removeUsersFromEvent(id: $id, userIds: $userIds) {
          id
          title
          date
          startTime
          endTime
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

    it('removes a users from event', async () => {
      const response = await graphQLCall({
        source: removeUsersFromEventQuery,
        variableValues: {
          id: dbEvent.id,
          userIds: [dbUsers[1].id],
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;
      const eventUsers = dbEventUsers.filter(u => u.id !== dbUsers[1].id);

      expect(response).toMatchObject({
        data: {
          removeUsersFromEvent: {
            id: dbEvent.id,
            title: dbEvent.title,
            date: dbEvent.date.toISOString(),
            startTime: dbEvent.startTime,
            endTime: dbEvent.endTime,
          },
        },
      });
      expect(response!.data!.removeUsersFromEvent.users).toIncludeSameMembers(
        eventUsers
      );
      expect(dbEventUsers.find(u => u.id === dbUsers[1].id)).toBeUndefined();
    });

    it('does not remove a user that does not belong to event', async () => {
      const user = await createUser();
      const response = await graphQLCall({
        source: removeUsersFromEventQuery,
        variableValues: {
          id: dbEvent.id,
          userIds: [user.id],
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;

      expect(dbEventUsers).toIncludeSameMembers(dbUsers);
      expect(response.data!.removeUsersFromEvent).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not remove unknown user from event', async () => {
      const response = await graphQLCall({
        source: removeUsersFromEventQuery,
        variableValues: {
          id: dbEvent.id,
          userIds: [dbUsers[0].id + '__unknown__'],
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;

      expect(dbEventUsers).toIncludeSameMembers(dbUsers);
      expect(response.data!.removeUsersFromEvent).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });
  });

  describe('removeEvent()', () => {
    const removeEventQuery = `
      mutation RemoveEvent($id: ID!) {
        removeEvent(id: $id) {
          id
          title
          date
          startTime
          endTime
        }
      }
    `;
    let dbUsers: User[];
    let dbRoom: Room;
    let dbEvent: Event;

    beforeEach(async () => {
      dbRoom = await createRoom();
      dbUsers = await createUser(3);
      dbEvent = await createEvent(dbRoom.id, dbUsers);
    });

    it('removes event', async () => {
      const response = await graphQLCall({
        source: removeEventQuery,
        variableValues: {
          id: dbEvent.id,
        },
      });
      const dbEventAfterRemove = await Event.findOne(dbEvent.id);
      const eventRoomAfterRemove = await Room.findOne(dbEvent.roomId);
      const eventUsersAfterRemove = await User.find();

      expect(response).toMatchObject({
        data: {
          removeEvent: {
            id: dbEvent.id,
            title: dbEvent.title,
            date: dbEvent.date.toISOString(),
            startTime: dbEvent.startTime,
            endTime: dbEvent.endTime,
          },
        },
      });
      expect(dbEventAfterRemove).toBeUndefined();
      expect(eventRoomAfterRemove).toBeDefined();
      const roomEvents = await eventRoomAfterRemove!.events;
      expect((roomEvents || []).find(e => e.id === dbEvent.id)).toBeUndefined();
      expect(eventUsersAfterRemove).toHaveLength(dbUsers.length);
    });

    it('does not remove an unknown event', async () => {
      const response = await graphQLCall({
        source: removeEventQuery,
        variableValues: {
          id: dbEvent.id + '__unknown__',
        },
      });
      const dbEventAfterRemove = await Event.findOne(dbEvent.id);

      expect(dbEventAfterRemove).toBeDefined();
      expect(response.data).toEqual({ removeEvent: null });
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });
  });
});
