import { Resolver, Query, Args, Mutation, Arg } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Room } from '../entity/room';
import { QueryArgs, MutationArgs } from './arguments';
import { RoomInput } from './types/room-input';

@Resolver()
export class RoomResolver {
  @InjectRepository(Room)
  private readonly roomRepository: Repository<Room>;

  @Query(returns => [Room])
  rooms(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  @Query(returns => Room, { nullable: true })
  async room(@Args() { id }: QueryArgs): Promise<Room | null> {
    const room = await this.roomRepository.findOne(id);
    return room || null;
  }

  @Mutation(returns => Room)
  createRoom(@Arg('input') newRoomData: RoomInput): Promise<Room> {
    return this.roomRepository.save(newRoomData);
  }

  @Mutation(returns => Room, { nullable: true })
  async updateRoom(
    @Args() { id }: MutationArgs,
    @Arg('input') roomData: RoomInput
  ): Promise<Room> {
    const roomToUpdate = await this.roomRepository.findOne(id);
    if (!roomToUpdate) {
      throw new Error('Invalid room ID');
    }

    return this.roomRepository.save({
      ...roomToUpdate,
      ...roomData,
    });
  }

  @Mutation(returns => Room, { nullable: true })
  async removeRoom(@Args() { id }: MutationArgs): Promise<Room> {
    const roomToRemove = await this.roomRepository.findOne(id);
    if (!roomToRemove) {
      throw new Error('Invalid room ID');
    }

    await this.roomRepository.delete(id);
    return roomToRemove;
  }
}
