import { connectToDatabase } from '../service/create-connection';

module.exports = async () => {
  try {
    await connectToDatabase({ drop: true });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
