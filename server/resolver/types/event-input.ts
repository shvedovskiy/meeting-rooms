import { InputType, Field } from 'type-graphql';
import { Length, IsDateString, IsNotEmpty } from 'class-validator';

import { Event } from '../../entity/event';
import { IsAfter } from '../../service/validators/is-after';

@InputType({ description: 'New or update event data' })
export class EventInput implements Partial<Event> {
  @Length(1, 255)
  @Field()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  @Field()
  dateStart: string;

  @IsNotEmpty()
  @IsDateString()
  @IsAfter('dateStart')
  @Field()
  dateEnd: string;
}
