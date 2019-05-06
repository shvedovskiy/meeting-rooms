import { Resolver, Query, Mutation, Args, Arg } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { User } from '../entity/user';
import { UserInput } from './types/user-input';
import { QueryArgs, MutationArgs } from './arguments';

@Resolver()
export class UserResolver {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Query(returns => [User])
  users(): Promise<User[]> {
    return this.userRepository.find();
  }

  @Query(returns => User)
  user(@Args() { id }: QueryArgs): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  @Mutation(returns => User)
  createUser(@Arg('input') newUserData: UserInput): Promise<User> {
    return this.userRepository.save(newUserData);
  }

  @Mutation(returns => User)
  async updateUser(
    @Args() { id }: MutationArgs,
    @Arg('input') userData: UserInput
  ) {
    const userToUpdate = await this.userRepository.findOne(id);
    if (!userToUpdate) {
      throw new Error('Invalid user ID');
    }

    return this.userRepository.save({
      ...userToUpdate,
      ...userData,
    });
  }

  @Mutation(returns => User)
  async removeUser(@Args() { id }: MutationArgs): Promise<User> {
    const userToDelete = await this.userRepository.findOne(id);
    if (!userToDelete) {
      throw new Error('Invalid user ID');
    }

    await this.userRepository.delete(id);
    return userToDelete;
  }
}
