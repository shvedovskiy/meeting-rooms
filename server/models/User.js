function User(sequelize, DataTypes) {
  return sequelize.define('User', {
    login: DataTypes.STRING,
    homeFloor: DataTypes.TINYINT,
    avatarUrl: DataTypes.STRING
  });
}

 module.exports = User;
 