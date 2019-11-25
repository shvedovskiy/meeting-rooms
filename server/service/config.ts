import { config } from 'dotenv-flow';

config();

export const NODE_ENV = process.env.NODE_ENV || 'production';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export const isProdEnv = NODE_ENV === 'production';
export const isTestEnv = NODE_ENV === 'test';

export const PORT = process.env.SERVER_PORT || 3090;
export const DATABASE_NAME = process.env.DATABASE_NAME || 'db.sqlite3';
export const REFRESH_DB = (process.env.REFRESH_DB || 'false') === 'true';
export const SEED_DB = (process.env.SEED_DB || 'false') === 'true';
