// @flow
import type Sequelize from 'sequelize';
import type { DataTypes as SequelizeDataTypes } from 'sequelize';


export default function User(sequelize: Sequelize, DataTypes: SequelizeDataTypes) {
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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
}
