import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';

import { Event } from '../../entity/event';

@InputType({ description: 'New event data' })
export class EventInput implements Partial<Event> {
  @Length(1, 255)
  @Field()
  title: string;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  startTime?: string;

  @Field({ nullable: true })
  endTime?: string;
}

@InputType({ description: 'Update event data' })
export class UpdateEventInput implements Partial<Event> {
  @Length(1, 255)
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  startTime?: string;

  @Field({ nullable: true })
  endTime?: string;
}
