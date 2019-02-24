const GraphQLDate = require('graphql-date');

const query = require('./query');
const mutation = require('./mutation');

module.exports = {
  Query: query,
  Mutation: mutation,
  Event: {
    // relative queries
    users(event) {
      return event.getUsers();
    },
    room(event) {
      return event.getRoom();
    },
  },
  Date: GraphQLDate,
};
