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

describe('User Query', () => {
  describe('users()', () => {
    const usersQuery = `
      query Users {
        users {
          id
          login
          homeFloor
          avatarUrl
        }
      }
    `;
    it('returns list of users', async () => {
      await User.insert([
        {
          login: faker.internet.userName(),
          homeFloor: faker.random.number({ max: 255 }),
          avatarUrl: faker.image.avatar(),
        },
        {
          login: faker.internet.userName(),
          homeFloor: faker.random.number({ max: 255 }),
          avatarUrl: faker.image.avatar(),
        },
        {
          login: faker.internet.userName(),
          homeFloor: faker.random.number({ max: 255 }),
          avatarUrl: faker.image.avatar(),
        },
      ]);
      const users = await User.find();

      const response = await graphQLCall({
        source: usersQuery,
      });

      expect(response).toMatchObject({
        data: {
          users: [
            {
              id: users[0].id,
              login: users[0].login,
              homeFloor: users[0].homeFloor,
              avatarUrl: users[0].avatarUrl,
            },
            {
              id: users[1].id,
              login: users[1].login,
              homeFloor: users[1].homeFloor,
              avatarUrl: users[1].avatarUrl,
            },
            {
              id: users[2].id,
              login: users[2].login,
              homeFloor: users[2].homeFloor,
              avatarUrl: users[2].avatarUrl,
            },
          ],
        },
      });
    });

    it('returns empty list if there are no users', async () => {
      const response = await graphQLCall({
        source: usersQuery,
      });

      expect(response).toMatchObject({
        data: {
          users: [],
        },
      });
    });
  });

  describe('user()', () => {
    const userQuery = `
      query User($id: ID!) {
        user(id: $id) {
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

    it('returns user data corresponding to the passed id', async () => {
      const response = await graphQLCall({
        source: userQuery,
        variableValues: {
          id: dbUser.id,
        },
      });

      expect(response).toMatchObject({
        data: {
          user: {
            id: dbUser.id,
            login: dbUser.login,
            homeFloor: dbUser.homeFloor,
            avatarUrl: dbUser.avatarUrl,
          },
        },
      });
    });

    it('returns nothing for unknown id', async () => {
      const response = await graphQLCall({
        source: userQuery,
        variableValues: {
          id: dbUser.id + '__unknown__',
        },
      });

      expect(response).toMatchObject({
        data: {
          user: null,
        },
      });
    });
  });
});
