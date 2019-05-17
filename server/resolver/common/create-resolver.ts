import { Resolver, Query, Mutation, ClassType, Arg, Args } from 'type-graphql';
import { Repository } from 'typeorm';

import { QueryArgs, MutationArgs } from '../arguments';
import { InjectRepository } from 'typeorm-typedi-extensions';

export function createResolver<
  TEntity extends ClassType,
  TInput extends ClassType,
  TUpdateInput extends ClassType
>(
  suffix: string,
  capitalizedSuffix: string,
  Entity: TEntity,
  Input: TInput,
  UpdateInput: TUpdateInput
) {
  @Resolver()
  class ResolverCls {
    @InjectRepository(Entity)
    private readonly repository: Repository<TEntity>;

    @Query(returns => [Entity], { name: `${suffix}s` })
    getAll(): Promise<TEntity[]> {
      return this.repository.find();
    }

    @Query(returns => Entity, { name: `${suffix}`, nullable: true })
    async getOne(@Args() { id }: QueryArgs): Promise<TEntity | null> {
      const entity = await this.repository.findOne(id);
      return entity || null;
    }

    @Mutation(returns => Entity, { name: `create${capitalizedSuffix}` })
    create(@Arg('input', type => Input) inputData: any): Promise<TEntity> {
      return this.repository.save(inputData);
    }

    @Mutation(returns => Entity, {
      name: `update${capitalizedSuffix}`,
      nullable: true,
    })
    async update(
      @Args() { id }: MutationArgs,
      @Arg('input', type => UpdateInput) inputData: any
    ): Promise<TEntity> {
      const entity = await this.repository.findOne(id);
      if (!entity) {
        throw new Error(`Invalid ${suffix} ID`);
      }

      return this.repository.save({
        ...entity,
        ...inputData,
      });
    }

    @Mutation(returns => Entity, {
      name: `remove${capitalizedSuffix}`,
      nullable: true,
    })
    async remove(@Args() { id }: MutationArgs): Promise<TEntity> {
      const entity = await this.repository.findOne(id);
      if (!entity) {
        throw new Error(`Invalid ${suffix} ID`);
      }

      await this.repository.delete(id);
      return entity;
    }
  }

  return ResolverCls;
}
