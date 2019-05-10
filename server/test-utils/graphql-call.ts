import { GraphQLSchema, graphql } from 'graphql';
import Maybe from 'graphql/tsutils/Maybe';

import { createSchema } from '../create-schema';

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

let schema: GraphQLSchema;

export async function graphQLCall({ source, variableValues }: Options) {
  if (!schema) {
    schema = await createSchema();
  }
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {},
  });
}
