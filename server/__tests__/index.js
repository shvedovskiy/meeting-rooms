const { tester } = require('graphql-tester');

const { PORT } = require('../config');

// function mockDatabase(dataToMock) {
//   const sequelizeMock = new SequelizeMock();
//   const dataMock = {
//     sequelize: sequelizeMock,
//     models: {
//       User: null,
//       Room: null,
//       Event: null,
//     },
//   };
//   for (const table of dataToMock) {
//     dataMock.models[
//       table.name.substring(0, table.name.length - 1)
//     ] = sequelizeMock.define(table.name, table.defaultValues, table.options);
//   }
//   return dataMock;
// }

describe('Query Resolvers', () => {
  let test;

  beforeAll(() => {
    test = tester({
      url: `http://127.0.0.1:${PORT}/graphql`,
      contentType: 'application/json',
    });
  });

  describe('User', () => {
    it('should return user info', done => {
      const id = '1';
      const expectedUserInfo = {
        id,
        login: 'veged',
        homeFloor: 0,
        avatarUrl: 'https://avatars3.githubusercontent.com/u/15365?s=460&v=4',
      };

      test(
        JSON.stringify({
          query: `{
            user(id: ${id}) {
              id
              login
              homeFloor
              avatarUrl
            }
          }`,
        }),
      )
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.success).toBe(true);
          expect(response.data.user).toEqual(expectedUserInfo);
        })
        .catch(console.error)
        .finally(done);
    });
  });
});
