import { Field, ID, ArgsType } from 'type-graphql';
import { IsNotEmpty } from 'class-validator';

import { EventUpdateInput } from './types/event-input';

@ArgsType()
export class IdArg {
  @IsNotEmpty()
  @Field(type => ID)
  id: string;
}

@ArgsType()
export class QueryArgs extends IdArg {}

@ArgsType()
export class MutationArgs extends IdArg {}

@ArgsType()
export class EventRelationArgs {
  @Field(type => [ID], { nullable: true })
  userIds: string[] = [];

  @IsNotEmpty()
  @Field(type => ID)
  roomId: string;
}

@ArgsType()
export class EventUpdateArgs {
  @Field(type => EventUpdateInput, { nullable: true })
  input: EventUpdateInput;

  @Field(type => [ID], { nullable: true })
  userIds: string[];

  @IsNotEmpty()
  @Field(type => ID, { nullable: true })
  roomId: string;
}
