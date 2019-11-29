import 'reflect-metadata';

import { NODE_ENV, REFRESH_DB, SEED_DB } from './service/config';
import { connectToDatabase } from './service/create-connection';

connectToDatabase({
  log: NODE_ENV === 'development',
  drop: REFRESH_DB,
  seed: SEED_DB,
})
  .then(() => {
    process.exit();
  })
  .catch(console.error);
