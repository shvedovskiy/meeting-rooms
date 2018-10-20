function User(sequelize, DataTypes) {
  return sequelize.define('User', {
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    homeFloor: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
  });
}

 module.exports = User;
 