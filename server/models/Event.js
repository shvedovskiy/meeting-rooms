function Event(sequelize, DataTypes) {
  return sequelize.define('Event', {
    title: DataTypes.STRING,
    dateStart: DataTypes.DATE,
    dateEnd: DataTypes.DATE,
  });
}

module.exports = Event;
