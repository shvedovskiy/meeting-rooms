import { Field, ID, ArgsType } from 'type-graphql';
import { IsNotEmpty } from 'class-validator';

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
  usersIds: string[] = [];

  @IsNotEmpty()
  @Field(type => ID)
  roomId: string;
}
