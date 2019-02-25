// @flow
import sequelize from '../../models';
import type { QueryArgs } from '../types';
import type { MutationArgs } from './types';


const { models: { User }} = sequelize;

const Query = {
  user(_: any, { id }: QueryArgs) {
    return User.findByPk(id);
  },
  users() {
    return User.findAll();
  },
};

const Mutation = {
  createUser(_: any, { input }: MutationArgs) {
    return User.create(input);
  },
  updateUser(_: any, { id, input }: MutationArgs) {
    return User.findById(id)
      .then(user => user.update(input))
      .catch(() => false);
  },
  removeUser(_: any, { id }: MutationArgs) {
    return User.findById(id)
      .then(user => user.destroy())
      .catch(() => false);
  },
};

export default { Query, Mutation };
