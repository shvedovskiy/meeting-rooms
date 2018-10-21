const { models: { User, Room, Event }} = require('../../models');


module.exports = {
  // User
  createUser(_, { input }) {
    return User.create(input);
  },
  updateUser(_, { id, input }) {
    return User.findById(id)
      .then(user => user.update(input))
      .catch(() => false);
  },
  removeUser(_, { id }) {
    return User.findById(id)
      .then(user => user.destroy())
      .catch(() => false);
  },

  // Room
  createRoom(_, { input }) {
    return Room.create(input);
  },
  updateRoom(_, { id, input }) {
    return Room.findById(id)
      .then(room => room.update(input))
      .catch(() => false);
  },
  removeRoom(_, { id }) {
    return Room.findById(id)
      .then(room => room.destroy())
      .catch(() => false);
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
  addUserToEvent(_, { id, userId }) {
    return Event.findById(id)
      .then(event => {
        return event.addUser(userId).then(() => event);
      });
  },
  removeUserFromEvent(_, { id, userId }) {
    return Event.findById(id)
      .then(event => {
        return event.removeUser(userId).then(() => event);
      });
  },
  changeEventRoom(_, { id, roomId }) {
    return Event.findById(id)
      .then(event => event.setRoom(roomId));
  },
  removeEvent(_, { id }) {
    return Event.findById(id)
      .then(event => event.destroy());
  },
};
