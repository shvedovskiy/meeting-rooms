const { models: { User, Room, Event }} = require('../../models');


module.exports = {
  event(root, { id }) {
    return Event.findById(id);
  },
  events(root, args, context) {
    return Event.findAll(args, context);
  },
  user(root, { id }) {
    return User.findById(id);
  },
  users(root, args, context) {
    return User.findAll({}, context);
  },
  room(root, { id }) {
    return Room.findById(id);
  },
  rooms(root, args, context) {
    return Room.findAll({ offset: 1 }, context);
  },
};
