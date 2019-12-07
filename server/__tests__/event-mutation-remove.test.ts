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

describe('Event Mutation removeEvent()', () => {
  const removeEventQuery = `
      mutation RemoveEvent($id: ID!) {
        removeEvent(id: $id) {
          id
          title
          date
          startTime
          endTime
          room {
            id
          }
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
          room: {
            id: dbRoom.id,
          },
        },
      },
    });
    expect(dbEventAfterRemove).toBeUndefined();
    expect(eventRoomAfterRemove).toBeDefined();
    const roomEvents = await eventRoomAfterRemove!.events;
    expect((roomEvents ?? []).find(e => e.id === dbEvent.id)).toBeUndefined();
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
