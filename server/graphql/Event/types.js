// @flow
import type { Model } from 'sequelize';


type EventInput = {|
  title: string,
  dateStart: string,
  dateEnd: string,
|};

export type EventArgs = {|
  id?: string,
  input?: EventInput,
  userId?: string,
  roomId?: string,
  usersIds?: Array<string>,
|};

export type EventModel = Model<*>;
