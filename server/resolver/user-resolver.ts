import { User } from '../entity/user';
import { UserInput, UpdateUserInput } from './types/user-input';
import { createResolver } from './common/create-resolver';

export const UserResolver = createResolver('user', 'User', User, UserInput, UpdateUserInput);
