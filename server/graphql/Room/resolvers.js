// @flow
import sequelize from '../../models';
import type { QueryArgs } from '../types';
import type { MutationArgs } from './types';


const{ models: { Room }} = sequelize;

const Query = {
  room(_: any, { id }: QueryArgs) {
    return Room.findByPk(id);
  },
  rooms() {
    return Room.findAll();
  },
};

const Mutation = {
  createRoom(_: any, { input }: MutationArgs) {
    return Room.create(input);
  },
  updateRoom(_: any, { id, input }: MutationArgs) {
    return Room.findById(id)
      .then(room => room.update(input))
      .catch(() => false);
  },
  removeRoom(_: any, { id }: MutationArgs) {
    return Room.findById(id)
      .then(room => room.destroy())
      .catch(() => false);
  },
};

export default { Query, Mutation };
