import 'reflect-metadata';

import { isProdEnv, REFRESH_DB, SEED_DB } from './service/config';
import { connectToDatabase } from './service/create-connection';

connectToDatabase(isProdEnv, REFRESH_DB, SEED_DB)
  .then(() => {
    process.exit();
  })
  .catch(console.error);
