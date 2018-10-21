module.exports = function Event(sequelize, DataTypes) {
  return sequelize.define('Event', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { 
        notEmpty: true,
      },
    },
    dateStart: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    dateEnd: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    validate: {
      dateEndAfterDateStart() {
        if (this.dateStart > this.dateEnd) {
          throw new Error('Require end date after start date');
        }
      },
    },
  });
};
