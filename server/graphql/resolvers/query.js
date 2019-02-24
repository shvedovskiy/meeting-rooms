const {
  models: { User, Room, Event },
} = require('../../models');

module.exports = {
  user(_, { id }) {
    return User.findById(id);
  },
  users() {
    return User.findAll();
  },
  room(_, { id }) {
    return Room.findById(id);
  },
  rooms() {
    return Room.findAll();
  },
  event(_, { id }) {
    return Event.findById(id);
  },
  events() {
    return Event.all();
  },
};
