import 'reflect-metadata';

import { isProdEnv } from './service/config';
import { connectToDatabase } from './service/create-connection';

connectToDatabase(isProdEnv, true, true)
  .then(() => {
    process.exit();
  })
  .catch(console.error);
