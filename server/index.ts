import 'reflect-metadata';

import path from 'path';
import { useContainer } from 'typeorm';
import { Container } from 'typedi';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import favicon from 'serve-favicon';

import { HOST, PORT, NODE_ENV, FRONTEND_URL } from './service/config';
import { createSchema } from './service/create-schema';
import { connectToDatabase } from './service/create-connection';

useContainer(Container);

async function bootstrapServer() {
  try {
    await connectToDatabase({ log: NODE_ENV === 'development' });
    const schema = await createSchema();
    const server = new ApolloServer({ schema, context: {} });

    const app = express();
    if (NODE_ENV === 'production') {
      app.use(favicon(path.join(__dirname, '..', 'build', 'favicon.ico')));
    }
    app.use(
      '/static',
      express.static(path.join(__dirname, '..', 'build', 'static'), {
        maxAge: 31536000,
      })
    );
    app.use(express.static(path.join(__dirname, '..', 'build')));
    app.use(express.static(path.join(__dirname, 'assets')));
    server.applyMiddleware({
      app,
      cors: FRONTEND_URL
        ? {
            origin: FRONTEND_URL,
            credentials: true,
          }
        : false,
    });

    app.listen({ port: PORT }, (err?: string) => {
      if (err) {
        throw new Error(err);
      }
      console.info(`🚀 Server running at http://${HOST}:${PORT} in ${NODE_ENV} mode`);
    });
  } catch (err) {
    console.error(err);
  }
}

bootstrapServer();
