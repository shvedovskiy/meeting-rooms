const Sequelize = require('sequelize');

const scheme = require('./scheme');
const { DATABASE_NAME } = require('../config');

const Op = Sequelize.Op;
const sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  storage: DATABASE_NAME,
  operatorsAliases: {
    $and: Op.and,
  },
  logging: false,
});

scheme(sequelize);

// export default sequelize;
module.exports = {
  sequelize,
  models: sequelize.models,
};
