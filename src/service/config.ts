import { config, DotenvConfigOptions } from 'dotenv-flow';

interface CustomDotenvConfigOptions extends DotenvConfigOptions {
  silent?: boolean;
}
const dotenvOptions: CustomDotenvConfigOptions = {
  silent: true,
};
config(dotenvOptions);

export const NODE_ENV = process.env.NODE_ENV || 'production';
export const SERVER_URL = process.env.REACT_APP_SERVER_URL || '';
