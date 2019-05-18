import { Connection } from 'typeorm';
import faker from 'faker';

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
      mutation CreateEvent($input: EventInput!, $roomId: ID!, $usersIds: [ID!]) {
        createEvent(input: $input, roomId: $roomId, usersIds: $usersIds) {
          id
          title
          dateStart
          dateEnd
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
      dbUsers = (await createUser(3)) as User[];
      dbRoom = (await createRoom()) as Room;
    });

    it('creates an event with specified properties', async () => {
      const newEventData = {
        title: faker.random.word(),
        dateStart: faker.date.past(),
        dateEnd: faker.date.future(),
      };

      const response = await graphQLCall({
        source: createEventQuery,
        variableValues: {
          input: newEventData,
          roomId: dbRoom.id,
          usersIds: dbUsers.map(user => user.id),
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
            dateStart: newEventData.dateStart.toISOString(),
            dateEnd: newEventData.dateEnd.toISOString(),
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
        dateStart: faker.date.past(),
        dateEnd: faker.date.future(),
      };

      const response = await graphQLCall({
        source: createEventQuery,
        variableValues: {
          input: newEventData,
          roomId: dbRoom.id,
          usersIds: dbUsers.map(user => user.id),
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
          usersIds: dbUsers.map(user => user.id),
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
        mutation CreateEvent($input: EventInput!, $usersIds: [ID!]) {
          createEvent(input: $input, userIds: $userIds) {
            id
            title
            dateStart
            dateEnd
            users {
              id
            }
          }
        }
      `;
      const newEventData = {
        title: faker.random.word(),
        dateStart: faker.date.past(),
        dateEnd: faker.date.future(),
      };

      const response = await graphQLCall({
        source: eventQuery,
        variableValues: {
          input: newEventData,
          usersIds: dbUsers.map(user => user.id),
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
        dateStart: faker.date.past(),
        dateEnd: faker.date.future(),
      };

      const response = await graphQLCall({
        source: createEventQuery,
        variableValues: {
          input: newEventData,
          roomId: dbRoom.id + '__unknown__',
          usersIds: dbUsers.map(user => user.id),
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
            dateStart
            dateEnd
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
        dateStart: faker.date.past(),
        dateEnd: faker.date.future(),
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
            dateStart: newEventData.dateStart.toISOString(),
            dateEnd: newEventData.dateEnd.toISOString(),
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
        dateStart: faker.date.past(),
        dateEnd: faker.date.future(),
      };

      const response = await graphQLCall({
        source: createEventQuery,
        variableValues: {
          input: newEventData,
          roomId: dbRoom.id,
          usersIds: [
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
            dateStart: newEventData.dateStart.toISOString(),
            dateEnd: newEventData.dateEnd.toISOString(),
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
        dateStart: faker.date.past(),
        dateEnd: faker.date.future(),
      };
      const secondEventData = {
        title: commonTitle,
        dateStart: faker.date.past(),
        dateEnd: faker.date.future(),
      };

      await graphQLCall({
        source: createEventQuery,
        variableValues: {
          input: firstEventData,
          roomId: dbRoom.id,
          usersIds: dbUsers.map(user => user.id),
        },
      });
      const response = await graphQLCall({
        source: createEventQuery,
        variableValues: {
          input: secondEventData,
          roomId: dbRoom.id,
          usersIds: dbUsers.map(user => user.id),
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

  describe('updateEvent()', () => {
    const updateEventQuery = `
      mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
        updateEvent(id: $id, input: $input) {
          id
          title
          dateStart
          dateEnd
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
      dbUsers = (await createUser(3)) as User[];
      dbRoom = (await createRoom()) as Room;
      dbEvent = await createEvent(dbRoom.id, dbUsers);
    });

    it('updates event data', async () => {
      const updateData = {
        title: faker.random.word(),
        dateStart: dbEvent.dateStart,
        dateEnd: dbEvent.dateEnd,
      };
      updateData.dateStart.setHours(updateData.dateStart.getHours() + 1);
      updateData.dateEnd.setHours(updateData.dateEnd.getHours() + 1);

      const response = await graphQLCall({
        source: updateEventQuery,
        variableValues: {
          id: dbEvent.id,
          input: updateData,
        },
      });
      const usersIds = [
        { id: dbUsers[0].id },
        { id: dbUsers[1].id },
        { id: dbUsers[2].id },
      ];

      expect(response).toMatchObject({
        data: {
          updateEvent: {
            id: dbEvent.id,
            title: updateData.title,
            dateStart: updateData.dateStart.toISOString(),
            dateEnd: updateData.dateEnd.toISOString(),
            room: {
              id: dbRoom.id,
            },
          },
        },
      });
      expect(response!.data!.updateEvent.users).toIncludeAllMembers(usersIds);
    });

    it('updates part of event data', async () => {
      const updateData = {
        dateEnd: dbEvent.dateEnd,
      };
      updateData.dateEnd.setHours(updateData.dateEnd.getHours() + 1);

      const response = await graphQLCall({
        source: updateEventQuery,
        variableValues: {
          id: dbEvent.id,
          input: updateData,
        },
      });
      const usersIds = [
        { id: dbUsers[0].id },
        { id: dbUsers[1].id },
        { id: dbUsers[2].id },
      ];

      expect(response).toMatchObject({
        data: {
          updateEvent: {
            id: dbEvent.id,
            title: dbEvent.title,
            dateStart: dbEvent.dateStart.toISOString(),
            dateEnd: updateData.dateEnd.toISOString(),
            room: {
              id: dbRoom.id,
            },
          },
        },
      });
      expect(response!.data!.updateEvent.users).toIncludeAllMembers(usersIds);
    });

    it('does not update the event when passing extra properties', async () => {
      const updateData = {
        title: faker.random.word(),
        dateStart: dbEvent.dateStart,
        dateEnd: dbEvent.dateEnd,
        extra: true,
      };
      updateData.dateStart.setHours(updateData.dateStart.getHours() + 1);
      updateData.dateEnd.setHours(updateData.dateEnd.getHours() + 1);

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
        dateStart: dbEvent.dateStart,
        dateEnd: dbEvent.dateEnd,
      };
      updateData.dateStart.setHours(updateData.dateStart.getHours() + 1);
      updateData.dateEnd.setHours(updateData.dateEnd.getHours() + 1);

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

  describe('changeEventRoom()', () => {
    const changeEventRoomQuery = `
      mutation ChangeEventRoom($id: ID!, $roomId: String!) {
        changeEventRoom(id: $id, roomId: $roomId) {
          id
          title
          dateStart
          dateEnd
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
      dbRoom = (await createRoom()) as Room;
      dbEvent = await createEvent(dbRoom.id, []);
    });

    it('changes event room', async () => {
      const newDbRoom = (await createRoom()) as Room;

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
            dateStart: dbEvent.dateStart.toISOString(),
            dateEnd: dbEvent.dateEnd.toISOString(),
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

  describe('addUserToEvent()', () => {
    const addUserToEventQuery = `
      mutation AddUserToEvent($id: ID!, $userId: String!) {
        addUserToEvent(id: $id, userId: $userId) {
          id
          title
          dateStart
          dateEnd
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

    it('adds new user to event', async () => {
      const newDbUser = (await createUser()) as User;

      const response = await graphQLCall({
        source: addUserToEventQuery,
        variableValues: {
          id: dbEvent.id,
          userId: newDbUser.id,
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;

      expect(response).toMatchObject({
        data: {
          addUserToEvent: {
            id: dbEvent.id,
            title: dbEvent.title,
            dateStart: dbEvent.dateStart.toISOString(),
            dateEnd: dbEvent.dateEnd.toISOString(),
          },
        },
      });
      expect(response!.data!.addUserToEvent.users).toIncludeSameMembers([
        ...dbUsers,
        newDbUser,
      ]);
      expect(dbEventUsers.find(u => u.id === newDbUser.id)).toBeDefined();
    });

    it('does not add existing user to event', async () => {
      const response = await graphQLCall({
        source: addUserToEventQuery,
        variableValues: {
          id: dbEvent.id,
          userId: dbUsers[0].id,
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;

      expect(dbEventUsers).toIncludeSameMembers(dbUsers);
      expect(response.data!.addUserToEvent).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not add unknown user to event', async () => {
      const response = await graphQLCall({
        source: addUserToEventQuery,
        variableValues: {
          id: dbEvent.id,
          userId: dbUsers[0].id + '__unknown__',
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;

      expect(dbEventUsers).not.toContain({ id: dbUsers[0].id + '__unknown__' });
      expect(response.data!.addUserToEvent).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });
  });

  describe('removeUserFromEvent()', () => {
    const removeUserFromEventQuery = `
      mutation RemoveUserFromEvent($id: ID!, $userId: String!) {
        removeUserFromEvent(id: $id, userId: $userId) {
          id
          title
          dateStart
          dateEnd
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

    it('removes a user from event', async () => {
      const response = await graphQLCall({
        source: removeUserFromEventQuery,
        variableValues: {
          id: dbEvent.id,
          userId: dbUsers[1].id,
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;
      const eventUsers = dbEventUsers.filter(u => u.id !== dbUsers[1].id);

      expect(response).toMatchObject({
        data: {
          removeUserFromEvent: {
            id: dbEvent.id,
            title: dbEvent.title,
            dateStart: dbEvent.dateStart.toISOString(),
            dateEnd: dbEvent.dateEnd.toISOString(),
          },
        },
      });
      expect(response!.data!.removeUserFromEvent.users).toIncludeSameMembers(
        eventUsers
      );
      expect(dbEventUsers.find(u => u.id === dbUsers[1].id)).toBeUndefined();
    });

    it('does not remove a user that does not belong to event', async () => {
      const user = (await createUser()) as User;
      const response = await graphQLCall({
        source: removeUserFromEventQuery,
        variableValues: {
          id: dbEvent.id,
          userId: user.id,
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;

      expect(dbEventUsers).toIncludeSameMembers(dbUsers);
      expect(response.data!.removeUserFromEvent).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not remove unknown user from event', async () => {
      const response = await graphQLCall({
        source: removeUserFromEventQuery,
        variableValues: {
          id: dbEvent.id,
          userId: dbUsers[0].id + '__unknown__',
        },
      });
      const dbEventAfterUpdate = await Event.findOne(dbEvent.id);
      const dbEventUsers = await dbEventAfterUpdate!.users;

      expect(dbEventUsers).toIncludeSameMembers(dbUsers);
      expect(response.data!.removeUserFromEvent).toEqual(null);
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
          dateStart
          dateEnd
        }
      }
    `;
    let dbUsers: User[];
    let dbRoom: Room;
    let dbEvent: Event;

    beforeEach(async () => {
      dbRoom = (await createRoom()) as Room;
      dbUsers = (await createUser(3)) as User[];
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
            dateStart: dbEvent.dateStart.toISOString(),
            dateEnd: dbEvent.dateEnd.toISOString(),
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
