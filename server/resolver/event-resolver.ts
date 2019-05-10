import { Resolver, Query, Args, Mutation, Arg } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { User } from '../entity/user';
import { Event } from '../entity/event';
import { EventInput } from './types/event-input';
import { QueryArgs, MutationArgs, EventRelationArgs } from './arguments';

@Resolver()
export class EventResolver {
  @InjectRepository(Event)
  private readonly eventRepository: Repository<Event>;
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

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
    if (roomId.length > 0) {
      event.roomId = roomId;
    }
    return this.eventRepository.create(event).save();
  }

  @Mutation(returns => Event, { nullable: true })
  async updateEvent(
    @Args() { id }: MutationArgs,
    @Arg('input', type => EventInput) newEventData: EventInput
  ): Promise<Event> {
    const eventToUpdate = await this.eventRepository.findOne(id);
    if (!eventToUpdate) {
      throw new Error('Invalid event ID');
    }

    const updatedEvent = {
      ...eventToUpdate,
      ...newEventData,
    };
    return this.eventRepository.save(updatedEvent);
  }

  @Mutation(returns => Event, { nullable: true })
  async addUserToEvent(
    @Args() { id }: MutationArgs,
    @Arg('userId') userId: string
  ): Promise<Event> {
    const event = await this.eventRepository.findOne(id);
    if (!event) {
      throw new Error('Invalid event ID');
    }

    await this.eventRepository
      .createQueryBuilder()
      .relation(Event, 'users')
      .of(id)
      .add(userId);

    return this.eventRepository.findOne(id) as Promise<Event>;
  }

  @Mutation(returns => Event, { nullable: true })
  async removeUserFromEvent(
    @Args() { id }: MutationArgs,
    @Arg('userId') userId: string
  ): Promise<Event> {
    const event = await this.eventRepository.findOne(id);
    if (!event) {
      throw new Error('Invalid event ID');
    }

    await this.eventRepository
      .createQueryBuilder()
      .relation(Event, 'users')
      .of(id)
      .remove(userId);

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
