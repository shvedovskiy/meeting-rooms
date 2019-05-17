import { InputType, Field, Int } from 'type-graphql';
import { Length, IsUrl } from 'class-validator';

import { User } from '../../entity/user';

@InputType({ description: 'New or update user data' })
export class UserInput implements Partial<User> {
  @Length(1, 255)
  @Field()
  login: string;

  @Field(type => Int, { nullable: true })
  homeFloor?: number = 0;

  @Length(1, 255)
  @IsUrl()
  @Field({ nullable: true })
  avatarUrl?: string;
}

@InputType({ description: 'Update user data' })
export class UpdateUserInput implements Partial<User> {
  @Length(1, 255)
  @Field({ nullable: true })
  login?: string;

  @Field(type => Int, { nullable: true })
  homeFloor?: number;

  @Length(1, 255)
  @IsUrl()
  @Field({ nullable: true })
  avatarUrl?: string;
}
