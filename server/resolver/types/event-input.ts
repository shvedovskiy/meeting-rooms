import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';

import { Event } from '../../entity/event';
import { IsAfter } from '../../service/validators/is-after';

@InputType({ description: 'New or update event data' })
export class EventInput implements Partial<Event> {
  @Length(1, 255)
  @Field()
  title: string;

  @Field()
  dateStart: Date;

  @IsAfter('dateStart')
  @Field()
  dateEnd: Date;
}
