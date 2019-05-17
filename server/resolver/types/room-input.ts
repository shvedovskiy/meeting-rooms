import { InputType, Field, Int } from 'type-graphql';
import { Length, Min } from 'class-validator';

import { Room } from '../../entity/room';

@InputType({ description: 'New room data' })
export class RoomInput implements Partial<Room> {
  @Length(1, 255)
  @Field()
  title: string;

  @Min(1)
  @Field(type => Int, { nullable: true })
  capacity?: number = 1;

  @Field(type => Int, { nullable: true })
  floor?: number = 0;
}

@InputType({ description: 'Update room data' })
export class UpdateRoomInput implements Partial<Room> {
  @Length(1, 255)
  @Field({ nullable: true })
  title?: string;

  @Min(1)
  @Field(type => Int, { nullable: true })
  capacity?: number;

  @Field(type => Int, { nullable: true })
  floor?: number;
}
