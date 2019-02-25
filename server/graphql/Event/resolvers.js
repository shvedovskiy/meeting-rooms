// @flow
import sequelize from '../../models';
import type { QueryArgs } from '../types';
import type { EventArgs, EventModel } from './types';


const { models: { Event }} = sequelize;

const Query = {
  event(_: any, { id }: QueryArgs) {
    return Event.findByPk(id);
  },
  events() {
    return Event.findAll();
  },
};

const Mutation = {
  createEvent(_: any, { input, usersIds, roomId }: EventArgs) {
    console.log(input);
    console.log(usersIds);
    return Event.create(input)
      .then(event => {
        event.setRoom(roomId);
        return event.setUsers(usersIds)
          .then(() => event);
      });
  },
  updateEvent(_: any, { id, input }: EventArgs) {
    return Event.findById(id)
      .then(event => event.update(input));
  },
  addUserToEvent(_: any, { id, userId }: EventArgs) {
    return Event.findById(id)
      .then(event => {
        return event.addUser(userId).then(() => event);
      });
  },
  removeUserFromEvent(_: any, { id, userId }: EventArgs) {
    return Event.findById(id)
      .then(event => {
        return event.removeUser(userId).then(() => event);
      });
  },
  changeEventRoom(_: any, { id, roomId }: EventArgs) {
    return Event.findById(id)
      .then(event => event.setRoom(roomId));
  },
  removeEvent(_: any, { id }: EventArgs) {
    return Event.findById(id)
      .then(event => event.destroy());
  },
};

export default {
  Query,
  Mutation,
  Event: {
    users(event: EventModel) {
      return event.getUsers();
    },
    room(event: EventModel) {
      return event.getRoom();
    },
  },
};
