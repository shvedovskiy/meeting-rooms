import { config } from 'dotenv-flow';

config();

export const NODE_ENV = process.env.NODE_ENV || 'production';

export const isProdEnv = NODE_ENV === 'production';
export const isTestEnv = NODE_ENV === 'test';
