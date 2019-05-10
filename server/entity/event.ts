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

@ObjectType()
@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  readonly id: string;

  @Field()
  @Column('varchar', {
    length: 255,
    unique: true,
  })
  title: string;

  @Field(type => Date)
  @Column('datetime')
  dateStart: string;

  @Field(type => Date)
  @Column('datetime')
  dateEnd: string;

  @Column({ nullable: true })
  roomId?: string;

  @ManyToOne(type => Room, room => room.events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roomId ' })
  @Field(type => Room)
  room: Promise<Room>;

  @ManyToMany(type => User)
  @JoinTable()
  @Field(type => [User])
  users: Promise<User[] | null>;
}
