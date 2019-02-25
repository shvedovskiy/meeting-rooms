// @flow
import type Sequelize from 'sequelize';


export default function scheme(sequelize: Sequelize) {
  const User = sequelize.import('./User');
  const Room = sequelize.import('./Room');
  const Event = sequelize.import('./Event');

  Event.belongsToMany(User, { through: 'Events_Users' });
  User.belongsToMany(Event, { through: 'Events_Users' });
  Event.belongsTo(Room);
}
