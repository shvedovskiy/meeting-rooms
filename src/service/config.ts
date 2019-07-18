import { config } from 'dotenv-flow';

config();

export const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
export const SERVER_PORT = process.env.SERVER_PORT || '3000';
export const NODE_ENV = process.env.NODE_ENV || 'production';

export const isProdEnv = NODE_ENV === 'production';
export const isTestEnv = NODE_ENV === 'test';
