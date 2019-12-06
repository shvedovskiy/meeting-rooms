import { Connection } from 'typeorm';

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
  connection = await connectToDatabase({ drop: true });
});

afterAll(async () => {
  await connection.close();
});

afterEach(async () => {
  await connection.synchronize(true);
});

describe('Event Mutation Users', () => {
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
});
