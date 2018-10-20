function Room(sequelize, DataTypes) {
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
    },
    floor: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  });
}

 module.exports = Room;
 