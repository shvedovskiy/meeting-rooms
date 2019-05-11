import 'reflect-metadata';

import { useContainer } from 'typeorm';
import { Container } from 'typedi';
import { ApolloServer } from 'apollo-server';

import { isProdEnv, PORT, NODE_ENV } from './service/config';
import { createSchema } from './service/create-schema';
import { connectToDatabase } from './service/create-connection';

useContainer(Container);

async function bootstrapServer() {
  try {
    await connectToDatabase(isProdEnv);
    const schema = await createSchema();
    const server = new ApolloServer({ schema, context: {} });
    const { url } = await server.listen(PORT);
    console.info(`🚀 Server running at ${url} in ${NODE_ENV} mode`);
  } catch (err) {
    console.error(err);
  }
}

bootstrapServer();
