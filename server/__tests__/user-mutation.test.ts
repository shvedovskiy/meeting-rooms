/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Connection } from 'typeorm';
import faker from 'faker';

import { connectToDatabase } from '../service/create-connection';
import { graphQLCall } from '../test-utils/graphql-call';
import { User } from '../entity/user';

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

describe('User Mutation', () => {
  describe('createUser()', () => {
    const createUserQuery = `
      mutation CreateUser($input: UserInput!) {
        createUser(input: $input) {
          id
          login
          homeFloor
          avatarUrl
        }
      }
      `;
    it('creates a user with specified properties', async () => {
      const newUserData = {
        login: faker.internet.userName(),
        homeFloor: faker.random.number({ max: 255 }),
        avatarUrl: faker.image.avatar(),
      };

      const response = await graphQLCall({
        source: createUserQuery,
        variableValues: {
          input: newUserData,
        },
      });
      const dbUser = await User.findOne({
        where: { login: newUserData.login },
      });

      expect(dbUser).toBeDefined();
      expect(response).toMatchObject({
        data: {
          createUser: {
            id: dbUser!.id,
            login: newUserData.login,
            homeFloor: newUserData.homeFloor,
            avatarUrl: newUserData.avatarUrl,
          },
        },
      });
    });

    it('creates a user with default properties', async () => {
      const newUserData = {
        login: faker.internet.userName(),
      };

      const response = await graphQLCall({
        source: createUserQuery,
        variableValues: {
          input: newUserData,
        },
      });
      const dbUser = await User.findOne({
        where: { login: newUserData.login },
      });

      expect(dbUser).toBeDefined();
      expect(response).toMatchObject({
        data: {
          createUser: {
            id: dbUser!.id,
            login: newUserData.login,
            homeFloor: 0,
            avatarUrl: null,
          },
        },
      });
    });

    it('does not create a user without login data', async () => {
      const newUserData = {
        homeFloor: faker.random.number({ max: 255 }),
        avatarUrl: faker.image.avatar(),
      };

      const response = await graphQLCall({
        source: createUserQuery,
        variableValues: {
          input: newUserData,
        },
      });

      expect(response.data).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not create a user with duplicate login name', async () => {
      const commonLogin = faker.internet.userName();
      const firstUserData = {
        login: commonLogin,
        homeFloor: faker.random.number({ max: 254 }),
        avatarUrl: faker.image.avatar(),
      };
      const secondUserData = {
        login: commonLogin,
        homeFloor: firstUserData.homeFloor + 1,
        avatarUrl: faker.image.avatar(),
      };

      await graphQLCall({
        source: createUserQuery,
        variableValues: {
          input: firstUserData,
        },
      });
      const response = await graphQLCall({
        source: createUserQuery,
        variableValues: {
          input: secondUserData,
        },
      });

      expect(response.data).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });
  });

  describe('updateUser()', () => {
    const updateUserQuery = `
      mutation UpdateUser($id: ID!, $input: UserInput!) {
        updateUser(id: $id, input: $input) {
          id
          login
          homeFloor
          avatarUrl
        }
      }
      `;
    let dbUser: User;

    beforeEach(async () => {
      dbUser = await User.create({
        login: faker.internet.userName(),
        homeFloor: faker.random.number({ max: 254 }),
        avatarUrl: faker.image.avatar(),
      }).save();
    });

    it('updates user data', async () => {
      const updateData = {
        login: faker.internet.userName(),
        homeFloor: dbUser.homeFloor + 1,
        avatarUrl: faker.image.avatar(),
      };

      const response = await graphQLCall({
        source: updateUserQuery,
        variableValues: {
          id: dbUser.id,
          input: updateData,
        },
      });

      expect(response).toMatchObject({
        data: {
          updateUser: {
            id: dbUser.id,
            login: updateData.login,
            homeFloor: updateData.homeFloor,
            avatarUrl: updateData.avatarUrl,
          },
        },
      });
    });

    it('updates part of user data', async () => {
      const updateData = {
        homeFloor: dbUser.homeFloor + 1,
      };

      const response = await graphQLCall({
        source: updateUserQuery,
        variableValues: {
          id: dbUser.id,
          input: updateData,
        },
      });

      expect(response).toMatchObject({
        data: {
          updateUser: {
            id: dbUser.id,
            login: dbUser.login,
            homeFloor: updateData.homeFloor,
            avatarUrl: dbUser.avatarUrl,
          },
        },
      });
    });

    it('does not update the user when passing extra properties', async () => {
      const updateData = {
        login: faker.internet.userName(),
        homeFloor: dbUser.homeFloor + 1,
        avatarUrl: faker.image.avatar(),
        extra: true,
      };

      const response = await graphQLCall({
        source: updateUserQuery,
        variableValues: {
          id: dbUser.id,
          input: updateData,
        },
      });

      expect(response.data).toEqual(undefined);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });

    it('does not update unknown user', async () => {
      const updateData = {
        login: faker.internet.userName(),
        homeFloor: dbUser.homeFloor + 1,
        avatarUrl: faker.image.avatar(),
      };

      const response = await graphQLCall({
        source: updateUserQuery,
        variableValues: {
          id: dbUser.id + '__unknown__',
          input: updateData,
        },
      });

      expect(response.data).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
    });
  });

  describe('removeUser()', () => {
    const removeUserQuery = `
    mutation RemoveUser($id: ID!) {
      removeUser(id: $id) {
        id
        login
        homeFloor
        avatarUrl
      }
    }
    `;
    let dbUser: User;

    beforeEach(async () => {
      dbUser = await User.create({
        login: faker.internet.userName(),
        homeFloor: faker.random.number({ max: 255 }),
        avatarUrl: faker.image.avatar(),
      }).save();
    });

    it('removes user', async () => {
      const response = await graphQLCall({
        source: removeUserQuery,
        variableValues: {
          id: dbUser.id,
        },
      });
      const dbUserAfterRemove = await User.findOne(dbUser.id);

      expect(response).toMatchObject({
        data: {
          removeUser: {
            id: dbUser.id,
            login: dbUser.login,
            homeFloor: dbUser.homeFloor,
            avatarUrl: dbUser.avatarUrl,
          },
        },
      });
      expect(dbUserAfterRemove).toBeUndefined();
    });

    it('does not remove an unknown user', async () => {
      const response = await graphQLCall({
        source: removeUserQuery,
        variableValues: {
          id: dbUser.id + '__unknown__',
        },
      });
      const dbUserAfterRemove = await User.findOne(dbUser.id);

      expect(response.data).toEqual(null);
      expect(response.errors).toBeDefined();
      expect(response.errors).not.toHaveLength(0);
      expect(dbUserAfterRemove).toBeDefined();
    });
  });
});
