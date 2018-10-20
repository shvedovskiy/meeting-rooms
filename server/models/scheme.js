const Sequelize = require('sequelize');

module.exports = seq => {
  const User = seq.define('User', {
    login: Sequelize.STRING,
    homeFloor: Sequelize.TINYINT,
    avatarUrl: Sequelize.STRING,
  });

  const Room = seq.define('Room', {
    title: Sequelize.STRING,
    capacity: Sequelize.SMALLINT,
    floor: Sequelize.TINYINT
  });

  const Event = seq.define('Event', {
    title: Sequelize.STRING,
    dateStart: Sequelize.DATE,
    dateEnd: Sequelize.DATE,
  });

  Event.belongsToMany(User, { through: 'Events_Users' });
  User.belongsToMany(Event, { through: 'Events_Users' });
  Event.belongsTo(Room);

  return {
    Room, 
    Event, 
    User,
  };
};
