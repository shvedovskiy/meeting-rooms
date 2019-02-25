// @flow
export type QueryArgs = {|
  id: string,
|};

export type MutationArgs<I> = {|
  id?: string,
  input?: I,
|};
