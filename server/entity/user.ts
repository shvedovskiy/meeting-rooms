import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Field()
  @Column('varchar', {
    length: 255,
    unique: true,
  })
  login: string;

  @Field(type => Int)
  @Column('tinyint')
  homeFloor: number;

  @Field({ nullable: true })
  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  avatarUrl?: string;
}
