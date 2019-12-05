import { InputType, Field, ID } from 'type-graphql';
import { IsNotEmpty } from 'class-validator';

import { EventUpdateInput } from './event-input';

@InputType()
export class UpdateInput {
  @IsNotEmpty()
  @Field(type => ID)
  id: string;

  @Field(type => EventUpdateInput, { nullable: true })
  input: EventUpdateInput;

  @IsNotEmpty()
  @Field(type => ID, { nullable: true })
  roomId: string;

  @Field(type => [ID], { nullable: true })
  userIds: string[];
}
