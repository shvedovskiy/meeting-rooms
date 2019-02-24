module.exports = function User(sequelize, DataTypes) {
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
      allowNull: false,
      defaultValue: 1,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        isUrl: true,
        notEmpty: false,
      },
    },
  });
};
