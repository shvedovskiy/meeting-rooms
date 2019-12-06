import { Connection } from 'typeorm';

import { connectToDatabase } from '../service/create-connection';
import { graphQLCall } from '../test-utils/graphql-call';
import { createRoom, createEvent } from '../test-utils/create-db-entity';
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

describe('Event Mutation changeEventRoom()', () => {
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
