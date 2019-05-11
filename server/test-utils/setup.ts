import { connectToDatabase } from '../service/create-connection';

module.exports = async () => {
  try {
    await connectToDatabase(false, true, false);
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
