import { isProdEnv, REFRESH_DB, isTestEnv } from '../service/config';
import { connectToDatabase } from '../create-connection';

connectToDatabase(isProdEnv, isTestEnv || REFRESH_DB, REFRESH_DB)
  .then(() => {
    process.exit();
  })
  .catch(console.error);
