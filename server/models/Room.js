// @flow
import type Sequelize from 'sequelize';
import type { DataTypes as SequelizeDataTypes } from 'sequelize';


export default function Room(sequelize: Sequelize, DataTypes: SequelizeDataTypes) {
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
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
}
