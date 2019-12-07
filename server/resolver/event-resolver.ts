import { Resolver, Query, Args, Mutation, Arg } from 'type-graphql';
import {
  Repository,
  MoreThan,
  Transaction,
  TransactionRepository,
} from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { startOfDay, subDays } from 'date-fns';

import { User } from '../entity/user';
import { Room } from '../entity/room';
import { Event } from '../entity/event';
import { EventInput, EventUpdateInput } from './types/event-input';
import { UpdateInput } from './types/common-input';
import {
  QueryArgs,
  MutationArgs,
  EventRelationArgs,
  EventUpdateArgs,
} from './arguments';

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
    const today = subDays(startOfDay(Date.now()), 1).toISOString();
    return this.eventRepository.find({
      date: MoreThan(today),
    });
  }

  @Query(returns => [Event])
  allEvents(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  @Query(returns => Event, { nullable: true })
  async event(@Args() { id }: QueryArgs): Promise<Event | null> {
    const event = await this.eventRepository.findOne(id);
    return event ?? null;
  }

  private async _setEventUsers(event: Event, userIds: string[]) {
    const users: User[] = [];
    for (const userId of userIds) {
      const user = await this.userRepository.findOne(userId);
      if (user) {
        users.push(user);
      }
    }
    event.users = Promise.resolve(users);
  }

  @Mutation(returns => Event)
  async createEvent(
    @Arg('input', type => EventInput) newEventData: EventInput,
    @Args() { userIds, roomId }: EventRelationArgs
  ): Promise<Event> {
    const event = this.eventRepository.create(newEventData);
    await this._setEventUsers(event, userIds);
    const room = await this.roomRepository.findOne(roomId);
    if (!room) {
      throw new Error('Unknown room ID');
    }
    event.room = Promise.resolve(room);
    return this.eventRepository.save(event);
  }

  private async _updateEvent(
    id: string,
    input?: EventUpdateInput,
    userIds?: string[],
    roomId?: string,
    repository = this.eventRepository
  ) {
    const eventToUpdate = await repository.findOne(id);
    if (!eventToUpdate) {
      throw new Error('Invalid event ID');
    }
    let event = eventToUpdate;

    if (input) {
      event = Event.create({
        ...eventToUpdate,
        ...input,
      });
    }
    if (roomId) {
      this._changeEventRoom(event, roomId);
    }
    if (userIds) {
      await this._setEventUsers(event, userIds);
    }
    return repository.save(event);
  }

  @Mutation(returns => Event, { nullable: true })
  updateEvent(
    @Args() { id }: MutationArgs,
    @Args() { input, userIds, roomId }: EventUpdateArgs
  ): Promise<Event> {
    return this._updateEvent(id, input, userIds, roomId);
  }

  @Mutation(returns => [Event], { nullable: true })
  @Transaction()
  async updateEvents(
    @Arg('events', type => [UpdateInput])
    events: UpdateInput[],
    @TransactionRepository(Event) eventRepository?: Repository<Event>
  ): Promise<Event[]> {
    const updatedEvents: Event[] = [];
    if (eventRepository != null) {
      for (const { id, input, userIds, roomId } of events) {
        updatedEvents.push(
          await this._updateEvent(id, input, userIds, roomId, eventRepository)
        );
      }
    }
    return updatedEvents;
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
    for (const userId of userIds) {
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

    for (const userId of userIds) {
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

  private _changeEventRoom(event: Event, roomId: string) {
    if (roomId.length > 0) {
      if (event.roomId === roomId) {
        throw new Error('Cannot change room to the same');
      }
      event.roomId = roomId;
    }
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

    this._changeEventRoom(event, roomId);
    await this.eventRepository.save(event);
    return event;
  }

  @Mutation(returns => Event, { nullable: true })
  async removeEvent(@Args() { id }: MutationArgs): Promise<Event> {
    const eventToRemove = await this.eventRepository.findOne(id, {
      relations: ['room'],
    });
    if (!eventToRemove) {
      throw new Error('Invalid event ID');
    }

    await this.eventRepository.delete(id);
    return eventToRemove;
  }
}
