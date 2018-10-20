function Room(sequelize, DataTypes) {
  return sequelize.define('Room', {
    title: DataTypes.STRING,
    capacity: DataTypes.SMALLINT,
    floor: DataTypes.TINYINT,
  });
}

 module.exports = Room;
 