import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { User } from './user';
import { Room } from './room';
import { IsAfter } from '../service/validators/is-after';

@ObjectType()
@Entity()
export class Event extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Field()
  @Column('varchar', {
    length: 255,
  })
  title: string;

  @Field()
  @Column('datetime')
  date: Date;

  @Field()
  @Column('varchar')
  startTime: string;

  @Field()
  @IsAfter('dateStart')
  @Column('varchar')
  endTime: string;

  @Column({ nullable: true })
  roomId?: string;

  @Field(type => Room)
  @ManyToOne(
    type => Room,
    room => room.events,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn({ name: 'roomId' })
  room: Promise<Room>;

  @Field(type => [User])
  @ManyToMany(type => User)
  @JoinTable()
  users: Promise<User[]>;
}
