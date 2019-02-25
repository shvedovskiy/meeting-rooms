// @flow
import type { MutationArgs as Args } from '../types';


type RoomInput = {|
  title: string,
  capacity?: number,
  floor?: number,
|};

export type MutationArgs = Args<RoomInput>;
