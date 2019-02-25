// @flow
const User = `
  type User {
    id: ID!
    login: String!
    homeFloor: Int
    avatarUrl: String
  }
`;

const UserInput = `
  input UserInput {
    login: String!
    homeFloor: Int
    avatarUrl: String
  }
`;

export default [User, UserInput];
