import { User } from '../entity/user';
import { UserInput } from './types/user-input';
import { createResolver } from './common/create-resolver';

export const UserResolver = createResolver('user', 'User', User, UserInput);
