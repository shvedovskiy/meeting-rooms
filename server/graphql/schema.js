// @flow
import { makeExecutableSchema } from 'graphql-tools';
import GraphQLDate from 'graphql-date';

import User from './User/typeDefs';
import Room from './Room/typeDefs';
import Event from './Event/typeDefs';
import userResolvers from './User/resolvers';
import roomResolvers from './Room/resolvers';
import eventResolvers from './Event/resolvers';


const RootQuery = `  
  type Query {
    user(id: ID!): User
    users: [User]
    room(id: ID!): Room
    rooms: [Room]
    event(id: ID!): Event
    events: [Event]
  }
`;
const RootMutation = `
  type Mutation {
    createUser(input: UserInput!): User
    updateUser(id: ID!, input: UserInput!): User
    removeUser(id: ID!): User
    createRoom(input: RoomInput!): Room
    updateRoom(id: ID!, input: RoomInput!): Room
    removeRoom(id: ID!): Room
    createEvent(input: EventInput!, usersIds: [ID], roomId: ID!): Event
    updateEvent(id: ID!, input: EventInput!): Event
    addUserToEvent(id: ID!, userId: ID!): Event
    removeUserFromEvent(id: ID!, userId: ID!): Event
    changeEventRoom(id: ID!, roomId: ID!): Event
    removeEvent(id: ID!): Event
  }
`;
const SchemaDefinition = `
  scalar Date
  schema {
    query: Query
    mutation: Mutation
  }
`;

const rootResolvers = {
  Date: GraphQLDate,
};

export default makeExecutableSchema({
  typeDefs: [
    ...User,...Room,...Event,
    RootQuery, RootMutation,
    SchemaDefinition,
  ],
  resolvers: [
    rootResolvers,
    userResolvers, roomResolvers, eventResolvers,
  ],
});
