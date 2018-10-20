const { models: { User, Room, Event }} = require('../../models');


module.exports = {
  event(_, { id }) {
    return Event.findById(id);
  },
  getEvents() {
    return Event.findAll();
  },
  user(_, { id }) {
    return User.findById(id);
  },
  getUsers() {
    return User.findAll();
  },
  room(_, { id }) {
    return Room.findById(id);
  },
  getRooms() {
    return Room.findAll();
  },
};
