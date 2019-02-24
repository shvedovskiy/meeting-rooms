const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const { PORT } = require('./config');

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

app.listen({ port: PORT }, () => {
  console.info(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
  );
});
