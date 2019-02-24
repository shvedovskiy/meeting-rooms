module.exports = function Room(sequelize, DataTypes) {
  return sequelize.define('Room', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    capacity: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    floor: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  });
};
