import 'reflect-metadata';

import path from 'path';
import { useContainer } from 'typeorm';
import { Container } from 'typedi';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';

import { PORT, NODE_ENV, FRONTEND_URL } from './service/config';
import { createSchema } from './service/create-schema';
import { connectToDatabase } from './service/create-connection';

useContainer(Container);

async function bootstrapServer() {
  try {
    await connectToDatabase({ log: NODE_ENV === 'development' });
    const schema = await createSchema();
    const server = new ApolloServer({ schema, context: {} });

    const app = express();
    app.use(express.static(path.join(__dirname, 'assets')));
    app.use(
      cors({
        origin: FRONTEND_URL,
        credentials: true,
      })
    );
    server.applyMiddleware({ app, cors: false });

    app.listen({ port: PORT }, (err?: string) => {
      if (err) {
        throw new Error(err);
      }
      console.info(
        `🚀 Server running at http://localhost:${PORT} in ${NODE_ENV} mode`
      );
    });
  } catch (err) {
    console.error(err);
  }
}

bootstrapServer();
