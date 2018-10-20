const GraphQLDate = require('graphql-date');

const query = require('./query');
const mutation = require('./mutation');


module.exports = () => ({
  Query: query,
  Mutation: mutation,
  Event: {
    users(event) {
      event.getUsers();
    },
    room(event) {
      event.getRoom();
    },
  },
  Date: GraphQLDate,
});
