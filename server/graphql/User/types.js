// @flow
import type { MutationArgs as Args } from '../types';


type UserInput = {|
  login: string,
  homeFloor?: number,
  avatarUrl?: string,
|};

export type MutationArgs = Args<UserInput>;
