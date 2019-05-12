import { Connection } from 'typeorm';
import faker from 'faker';

import { connectToDatabase } from '../service/create-connection';
import { graphQLCall } from '../test-utils/graphql-call';
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

describe('Room Mutation', () => {
  describe('createRoom()', () => {
    const createRoomQuery = `
      mutation CreateRoom($input: RoomInput!) {
        createRoom(input: $input) {
          id
          title
          capacity
          floor
        }
      }
      `;
    it('creates a room with specified properties', async () => {
      const newRoomData = {
        title: faker.random.word(),
        capacity: faker.random.number({ max: 32000 }),
        floor: faker.random.number({ max: 255 }),
      };

      const response = await graphQLCall({
        source: createRoomQuery,
        variableValues: {
          input: newRoomData,
        },
      });
      const dbRoom = await Room.findOne({
        where: { login: newRoomData.title },
      });

      expect(dbRoom).toBeDefined();
      expect(response).toMatchObject({
        data: {
          createRoom: {
            id: dbRoom!.id,
            title: newRoomData.title,
            capacity: newRoomData.capacity,
            floor: newRoomData.floor,
          },
        },
      });
    });

    it('creates a room with default properties', async () => {
      const newRoomData = {
        title: faker.random.word(),
      };

      const response = await graphQLCall({
        source: createRoomQuery,
        variableValues: {
          input: newRoomData,
        },
      });
      const dbRoom = await Room.findOne({
        where: { title: newRoomData.title },
      });

      expect(dbRoom).toBeDefined();
      expect(response).toMatchObject({
        data: {
          createRoom: {
            id: dbRoom!.id,
            title: newRoomData.title,
            capacity: 1,
            floor: 0,
          },
        },
      });
    });

    it('does not create a room without title data', async () => {
      const newRoomData = {
        capacity: faker.random.number({ max: 32000 }),
        floor: faker.random.number({ max: 255 }),
      };

      const response = await graphQLCall({
        source: createRoomQuery,
        variableValues: {
          input: newRoomData,
        },
      });

      expect(response.data).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not create a room with duplicate title name', async () => {
      const commonTitle = faker.random.word();
      const firstRoomData = {
        title: commonTitle,
        capacity: faker.random.number({ max: 32000 }),
        floor: faker.random.number({ max: 255 }),
      };
      const secondRoomData = {
        title: commonTitle,
        capacity: faker.random.number({ max: 32000 }),
        floor: faker.random.number({ max: 255 }),
      };

      await graphQLCall({
        source: createRoomQuery,
        variableValues: {
          input: firstRoomData,
        },
      });
      const response = await graphQLCall({
        source: createRoomQuery,
        variableValues: {
          input: secondRoomData,
        },
      });

      expect(response.data).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });
  });

  describe('updateRoom()', () => {
    const updateRoomQuery = `
      mutation UpdateRoom($id: ID!, $input: RoomInput!) {
        updateRoom(id: $id, input: $input) {
          id
          title
          capacity
          floor
        }
      }
      `;
    let dbRoom: Room;

    beforeEach(async () => {
      dbRoom = await Room.create({
        title: faker.random.word(),
        capacity: faker.random.number({ max: 31999 }),
        floor: faker.random.number({ max: 254 }),
      }).save();
    });

    it('updates room data', async () => {
      const updateData = {
        title: faker.random.word(),
        capacity: dbRoom.capacity + 1,
        floor: dbRoom.floor + 1,
      };

      const response = await graphQLCall({
        source: updateRoomQuery,
        variableValues: {
          id: dbRoom.id,
          input: updateData,
        },
      });

      expect(response).toMatchObject({
        data: {
          updateRoom: {
            id: dbRoom.id,
            title: updateData.title,
            capacity: updateData.capacity,
            floor: updateData.floor,
          },
        },
      });
    });

    it('updates part of room data', async () => {
      const updateData = {
        capacity: dbRoom.capacity + 1,
      };

      const response = await graphQLCall({
        source: updateRoomQuery,
        variableValues: {
          id: dbRoom.id,
          input: updateData,
        },
      });

      expect(response).toMatchObject({
        data: {
          updateRoom: {
            id: dbRoom.id,
            title: dbRoom.title,
            capacity: updateData.capacity,
            floor: 0, // default value
          },
        },
      });
    });

    it('does not update the room when passing extra properties', async () => {
      const updateData = {
        title: faker.random.word(),
        capacity: dbRoom.capacity + 1,
        floor: dbRoom.floor + 1,
        extra: true,
      };

      const response = await graphQLCall({
        source: updateRoomQuery,
        variableValues: {
          id: dbRoom.id,
          input: updateData,
        },
      });

      expect(response.data).toEqual(undefined);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not update unknown room', async () => {
      const updateData = {
        title: faker.random.word(),
        capacity: dbRoom.capacity + 1,
        floor: dbRoom.floor + 1,
      };

      const response = await graphQLCall({
        source: updateRoomQuery,
        variableValues: {
          id: dbRoom.id + '__unknown__',
          input: updateData,
        },
      });

      expect(response.data).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });
  });

  describe('removeRoom()', () => {
    const removeRoomQuery = `
    mutation RemoveRoom($id: ID!) {
      removeRoom(id: $id) {
        id
        title
        capacity
        floor
      }
    }
    `;
    let dbRoom: Room;

    beforeEach(async () => {
      dbRoom = await Room.create({
        title: faker.random.word(),
        capacity: faker.random.number({ max: 32000 }),
        floor: faker.random.number({ max: 255 }),
      }).save();
    });

    it('removes room', async () => {
      const response = await graphQLCall({
        source: removeRoomQuery,
        variableValues: {
          id: dbRoom.id,
        },
      });
      const dbRoomAfterRemove = await Room.findOne(dbRoom.id);

      expect(response).toMatchObject({
        data: {
          removeRoom: {
            id: dbRoom.id,
            title: dbRoom.title,
            capacity: dbRoom.capacity,
            floor: dbRoom.floor,
          },
        },
      });
      expect(dbRoomAfterRemove).toBeUndefined();
    });

    it('does not remove an unknown room', async () => {
      const response = await graphQLCall({
        source: removeRoomQuery,
        variableValues: {
          id: dbRoom.id + '__unknown__',
        },
      });
      const dbRoomAfterRemove = await Room.findOne(dbRoom.id);

      expect(response.data).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
      expect(dbRoomAfterRemove).toBeDefined();
    });
  });
});