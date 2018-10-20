const { models: { User, Room, Event }} = require('../../models');


module.exports = {
  // User
  createUser(_, { input }) {
    return User.create(input);
  },
  updateUser(_, { id, input }) {
    return User.findById(id)
      .then(user => user.update(input));
  },
  removeUser(_, { id }) {
    return User.findById(id)
      .then(user => user.destroy());
  },

  // Room
  createRoom(_, { input }) {
    return Room.create(input);
  },
  updateRoom(_, { id, input }) {
    return Room.findById(id)
      .then(room => room.update(input));
  },
  removeRoom(_, { id }) {
    return Room.findById(id)
      .then(room => room.destroy());
  },

  // Event
  createEvent(_, { input, usersIds, roomId }) {
    return Event.create(input)
      .then(event => {
        event.setRoom(roomId);
        return event.setUsers(usersIds)
          .then(() => event);
      });
  },
  updateEvent(_, { id, input }) {
    return Event.findById(id)
      .then(event => event.update(input));
  },
  removeUserFromEvent(_, { id, userId }) {
    return Event.findById(id)
      .then(event => {
        event.removeUser(userId);
        return event;
      });
  },
  changeEventRoom(_, { id, roomId }) {
    return Event.findById(id)
      .then(event => {
        event.setRoom(id);
      });
  },
  removeEvent(_, { id }) {
    return Event.findById(id)
      .then(event => event.destroy());
  },
};
