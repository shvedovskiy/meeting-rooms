require('dotenv-flow').config();

const NODE_ENV = process.env.NODE_ENV || 'production';

module.exports.NODE_ENV = NODE_ENV;
module.exports.isTestEnv = NODE_ENV === 'test';
module.exports.PORT = process.env.SERVER_PORT || 3090;
module.exports.DATABASE_NAME = process.env.DATABASE_NAME || 'db.sqlite3';
