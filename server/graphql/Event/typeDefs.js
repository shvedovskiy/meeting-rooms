// @flow
const Event = `
  type Event {
    id: ID!
    title: String!
    dateStart: Date!
    dateEnd: Date!
    users: [User]
    room: Room
  }
`;

const EventInput = `
  input EventInput {
    title: String!
    dateStart: Date!
    dateEnd: Date!
  }
`;

export default [Event, EventInput];
