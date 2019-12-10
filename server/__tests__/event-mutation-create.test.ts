import { Connection } from 'typeorm';
import faker from 'faker';
import startOfDay from 'date-fns/startOfDay';

import { connectToDatabase } from '../service/create-connection';
import { graphQLCall } from '../test-utils/graphql-call';
import { createRoom, createUser } from '../test-utils/create-db-entity';
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

describe('Event Mutation createEvent()', () => {
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
          users: [{ id: dbUsers[0].id }, { id: dbUsers[1].id }, { id: dbUsers[2].id }],
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
        userIds: [dbUsers[0].id, dbUsers[1].id + '__unknown__', dbUsers[2].id],
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

  // it('does not create an event with duplicate title', async () => {
  //   const commonTitle = faker.random.word();
  //   const firstEventData = {
  //     title: commonTitle,
  //     date: startOfDay(faker.date.future()),
  //     startTime: '08:00',
  //     endTime: '09:15',
  //   };
  //   const secondEventData = {
  //     title: commonTitle,
  //     date: startOfDay(faker.date.future()),
  //     startTime: '16:50',
  //     endTime: '19:00',
  //   };

  //   await graphQLCall({
  //     source: createEventQuery,
  //     variableValues: {
  //       input: firstEventData,
  //       roomId: dbRoom.id,
  //       userIds: dbUsers.map(user => user.id),
  //     },
  //   });
  //   const response = await graphQLCall({
  //     source: createEventQuery,
  //     variableValues: {
  //       input: secondEventData,
  //       roomId: dbRoom.id,
  //       userIds: dbUsers.map(user => user.id),
  //     },
  //   });
  //   const dbEvents = await Event.find();

  //   expect(dbEvents).toHaveLength(1);
  //   expect(dbEvents[0].title).toBe(firstEventData.title);
  //   expect(response.data).toEqual(null);
  //   expect(response.errors).toBeDefined();
  //   expect(response.errors).not.toHaveLength(0);
  // });
});
