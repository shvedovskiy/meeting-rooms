import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';

import { Event } from './event';

@ObjectType()
@Entity()
export class Room extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Field()
  @Column('varchar', {
    length: 255,
    unique: true,
  })
  title: string;

  @Field(type => Int)
  @Column('smallint')
  minCapacity: number;

  @Field(type => Int)
  @Column('smallint')
  maxCapacity: number;

  @Field(type => Int)
  @Column('tinyint')
  floor: number;

  @OneToMany(
    type => Event,
    event => event.room
  )
  @Field(type => [Event], { nullable: true })
  events: Promise<Event[] | null>;
}
