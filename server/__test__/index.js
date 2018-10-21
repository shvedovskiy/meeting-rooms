const { tester } = require('graphql-tester');

const { PORT } = require('../config');


describe('User', () => {
  let test;

  beforeAll(() => {
    test = tester({
      url: `http://127.0.0.1:${PORT}/graphql`,
      contentType: 'application/json',
    });
  });

  it('create new user', done => {
    test(JSON.stringify({
      query: `
        mutation createNewUser($login: String!, $homeFloor: Int, $avatarUrl: String!) {
          createUser(input: { login: $login, homeFloor: $homeFloor, avatarUrl: $avatarUrl }) {
            id,
            login,
            homeFloor,
            avatarUrl
          }
        }
      `,
      variables: {
        login: 'Mock User',
        homeFloor: 42,
        avatarUrl: 'https://mock-img.io/123',
      },
    }))
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.success).toBe(true);
        done();
      });
  });
});
