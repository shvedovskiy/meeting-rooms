import { isProdEnv, REFRESH_DB } from './service/config';
import { connectToDatabase } from './service/create-connection';

connectToDatabase(isProdEnv, REFRESH_DB, REFRESH_DB)
  .then(() => {
    process.exit();
  })
  .catch(console.error);
