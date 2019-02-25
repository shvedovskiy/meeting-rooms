// @flow
import type Sequelize from 'sequelize';
import type { DataTypes as SequelizeDataTypes } from 'sequelize';


export default function Event(sequelize: Sequelize, DataTypes: SequelizeDataTypes) {
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
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        notEmpty: true,
      },
    },
    dateEnd: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
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
}
