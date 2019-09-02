import { Resolver, Query, Args, Mutation, Arg } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { User } from '../entity/user';
import { Room } from '../entity/room';
import { Event } from '../entity/event';
import { EventInput, UpdateEventInput } from './types/event-input';
import { QueryArgs, MutationArgs, EventRelationArgs } from './arguments';

@Resolver()
export class EventResolver {
  @InjectRepository(Event)
  private readonly eventRepository: Repository<Event>;
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  @InjectRepository(Room)
  private readonly roomRepository: Repository<Room>;

  @Query(returns => [Event])
  events(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  @Query(returns => Event, { nullable: true })
  async event(@Args() { id }: QueryArgs): Promise<Event | null> {
    const event = await this.eventRepository.findOne(id);
    return event || null;
  }

  @Mutation(returns => Event)
  async createEvent(
    @Arg('input', type => EventInput) newEventData: EventInput,
    @Args() { usersIds, roomId }: EventRelationArgs
  ): Promise<Event> {
    const event = this.eventRepository.create(newEventData);
    const users: User[] = [];
    for (const userId of usersIds) {
      const user = await this.userRepository.findOne(userId);
      if (user) {
        users.push(user);
      }
    }
    event.users = Promise.resolve(users);
    const room = await this.roomRepository.findOne(roomId);
    if (!room) {
      throw new Error('Unknown room ID');
    }
    event.room = Promise.resolve(room);
    return this.eventRepository.save(event);
  }

  @Mutation(returns => Event, { nullable: true })
  async updateEvent(
    @Args() { id }: MutationArgs,
    @Arg('input', type => UpdateEventInput) newEventData: UpdateEventInput
  ): Promise<Event> {
    const eventToUpdate = await this.eventRepository.findOne(id);
    if (!eventToUpdate) {
      throw new Error('Invalid event ID');
    }
    const event = Event.create({
      ...eventToUpdate,
      ...newEventData,
    });
    return this.eventRepository.save(event);
  }

  @Mutation(returns => Event, { nullable: true })
  async addUsersToEvent(
    @Args() { id }: MutationArgs,
    @Arg('userIds', type => [String]) userIds: string[]
  ): Promise<Event> {
    const event = await this.eventRepository.findOne(id);
    if (!event) {
      throw new Error('Invalid event ID');
    }

    const eventUsers = await event.users;
    for (let userId of userIds) {
      const user = await this.userRepository.findOne(userId);
      if (!user) {
        throw new Error('Invalid user ID');
      }

      const foundSameUser = eventUsers.find(u => u.id === userId);
      if (foundSameUser) {
        throw new Error('Unable to add same user');
      }

      await this.eventRepository
        .createQueryBuilder()
        .relation(Event, 'users')
        .of(id)
        .add(userId);
    }
    return this.eventRepository.findOne(id) as Promise<Event>;
  }

  @Mutation(returns => Event, { nullable: true })
  async removeUsersFromEvent(
    @Args() { id }: MutationArgs,
    @Arg('userIds', type => [String]) userIds: string[]
  ): Promise<Event> {
    const event = await this.eventRepository.findOne(id);
    if (!event) {
      throw new Error('Invalid event ID');
    }
    const eventUsers = await event.users;

    for (let userId of userIds) {
      const foundSameUser = eventUsers.find(u => u.id === userId);
      if (!foundSameUser) {
        throw new Error('Unable to remove user');
      }

      await this.eventRepository
        .createQueryBuilder()
        .relation(Event, 'users')
        .of(id)
        .remove(userId);
    }

    return this.eventRepository.findOne(id) as Promise<Event>;
  }

  @Mutation(returns => Event, { nullable: true })
  async changeEventRoom(
    @Args() { id }: MutationArgs,
    @Arg('roomId') roomId: string
  ): Promise<Event> {
    const event = await this.eventRepository.findOne(id);
    if (!event) {
      throw new Error('Invalid event ID');
    }

    if (roomId.length > 0) {
      if (event.roomId === roomId) {
        throw new Error('Cannot change room to the same');
      }
      event.roomId = roomId;
    }
    await this.eventRepository.save(event);
    return event;
  }

  @Mutation(returns => Event, { nullable: true })
  async removeEvent(@Args() { id }: MutationArgs): Promise<Event> {
    const eventToRemove = await this.eventRepository.findOne(id);
    if (!eventToRemove) {
      throw new Error('Invalid event ID');
    }

    await this.eventRepository.delete(id);
    return eventToRemove;
  }
}
