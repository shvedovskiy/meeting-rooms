// @flow
const Room = `
  type Room {
    id: ID!
    title: String!
    capacity: Int!
    floor: Int!
  }
`;

const RoomInput = `
  input RoomInput { 
    title: String!
    capacity: Int
    floor: Int
  }
`;

export default [Room, RoomInput];
