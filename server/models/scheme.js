function scheme(sequelize) {
  const User = sequelize.import('./User');
  const Event = sequelize.import('./Event');
  const Room = sequelize.import('./Room');

  Event.belongsToMany(User, { through: 'Events_Users' });
  User.belongsToMany(Event, { through: 'Events_Users' });
  Event.belongsTo(Room);

  return {
    Room, 
    Event, 
    User,
  };
}

module.exports = scheme;
