import { PageData } from 'context/page-context';
import { FormFields, FormErrors } from '../form-common/validators';
import { StateValidity, StateValues } from 'components/common/use-form';
import { RoomCard, Event, RoomData } from 'components/timesheet/types';
import { UpdateEventVariables } from 'service/mutations';

export type MovedRoomsEvents = Map<string, UpdateEventVariables[]>;
export interface DayTable {
  [roomId: string]: string[];
}

export const defaultFormValues = {
  title: '',
  startTime: '',
  endTime: '',
  date: null,
  users: null,
  room: null,
};

export function roomsDisplayed(
  validity: StateValidity<FormErrors>,
  values: StateValues<FormFields>,
  initialValues: PageData
) {
  const {
    startTime: startTimeValid,
    endTime: endTimeValid,
    time: timeValid,
    date: dateValid,
    users: usersValid,
  } = validity;

  // Initial state:
  if (Object.values(validity).every(v => typeof v === 'undefined')) {
    return initialValues.hasOwnProperty('room');
  }

  const validities = [startTimeValid, endTimeValid, dateValid];
  // Room is not selected:
  if (!values.room) {
    validities.push(usersValid);
  }

  // Edit/partial add mode:
  if (initialValues.room) {
    if (validities.every(v => typeof v === 'undefined')) {
      return values.room !== null;
    }
    const allValidities = validities.concat([timeValid]);
    return (
      allValidities.every(v => v !== false) &&
      [values.date, values.startTime, values.endTime, values.users].every(
        Boolean
      )
    );
  }
  // Plain add mode:
  return validities.every(Boolean) && timeValid !== false;
}

export function recommendationNeeded(
  validity: StateValidity<FormErrors>,
  values: StateValues<FormFields>,
  initialValues: PageData
) {
  return !values.room && roomsDisplayed(validity, values, initialValues);
}

export function handleFormChange(
  changed: Partial<FormFields>,
  state: StateValues<FormFields>
) {
  if (
    state.room &&
    ['startTime', 'endTime', 'date'].some(f => changed.hasOwnProperty(f))
  ) {
    return {
      ...changed,
      room: null,
    };
  }
  if (changed.room) {
    return {
      ...changed,
      startTime: changed.room.startTime,
      endTime: changed.room.endTime,
    };
  }
  return changed;
}

export function measureDistanceToRoom<T extends RoomCard | RoomData>(
  roomDef: T,
  eventUsersFloors: number[]
) {
  return Math.abs(
    eventUsersFloors.reduce((sum, next) => sum + (roomDef.floor - next), 0)
  );
}

function distanceToNewRoom(
  eventId: string,
  newFloor: number,
  allEvents: Map<string, Event>
) {
  const floors = allEvents.get(eventId)!.users.map(u => u.homeFloor);
  return Math.abs(floors.reduce((sum, next) => sum + (newFloor - next), 0));
}

export function measureDistanceToNewRoom(
  roomDef: RoomCard,
  moved: MovedRoomsEvents,
  allEvents: Map<string, Event>,
  eventUsersFloors: number[]
) {
  const movedDistance = moved
    .get(roomDef.id)!
    .map(event => distanceToNewRoom(event.id, roomDef.floor, allEvents))
    .reduce((sum, next) => sum + next, 0);

  return Math.abs(
    eventUsersFloors.reduce(
      (sum, next) => sum + (roomDef.floor - next) + movedDistance,
      0
    )
  );
}

export function measureDistanceToAnyRoom(
  roomDef: RoomCard,
  moved: MovedRoomsEvents,
  allEvents: Map<string, Event>,
  eventUsersFloors: number[]
) {
  if (moved.has(roomDef.id)) {
    return measureDistanceToNewRoom(
      roomDef,
      moved,
      allEvents,
      eventUsersFloors
    );
  }
  return measureDistanceToRoom(roomDef, eventUsersFloors);
}
