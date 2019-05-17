import { Room } from '../entity/room';
import { RoomInput, UpdateRoomInput } from './types/room-input';
import { createResolver } from './common/create-resolver';

export const RoomResolver = createResolver(
  'room',
  'Room',
  Room,
  RoomInput,
  UpdateRoomInput
);
