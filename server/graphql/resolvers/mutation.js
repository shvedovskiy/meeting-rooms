const { models: { User, Room, Event }} = require('../../models');


module.exports = {
  // User
  createUser(root, { input }, context) {
    return User.create(input);
  },
  updateUser(root, { id, input }, context) {
    return User.findById(id)
      .then(user => user.update(input));
  },
  removeUser(root, { id }, context) {
    return User.findById(id)
      .then(user => user.destroy());
  },

  // Room
  createRoom(root, { input }, context) {
    return Room.create(input);
  },
  updateRoom(root, { id, input }, context) {
    return Room.findById(id)
      .then(room => room.update(input));
  },
  removeRoom(root, { id }, context) {
    return Room.findById(id)
      .then(room => room.destroy());
  },

  // Event
  createEvent(root, { input, usersIds, roomId }, context) {
    return Event.create(input)
      .then(event => {
        event.setRoom(roomId);
        return event.setUsers(usersIds)
          .then(() => event);
      });
  },
  updateEvent(root, { id, input }, context) {
    return Event.findById(id)
      .then(event => event.update(input));
  },
  removeUserFromEvent(root, { id, userId }, context) {
    return Event.findById(id)
      .then(event => {
        event.removeUser(userId);
        return event;
      });
  },
  changeEventRoom(root, { id, roomId }, context) {
    return Event.findById(id)
      .then(event => {
        event.setRoom(id);
      });
  },
  removeEvent(root, { id }, context) {
    return Event.findById(id)
      .then(event => event.destroy());
  },
};
