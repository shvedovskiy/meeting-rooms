import { PageData } from 'context/page-context';
import { FormFields } from '../form-common/validators';
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
  validity: StateValidity<FormFields>,
  roomValue: RoomCard | null,
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
  if (!roomValue) {
    validities.push(usersValid);
  }

  // Edit/partial add mode:
  if (initialValues.room) {
    if (validities.every(v => typeof v === 'undefined')) {
      return roomValue !== null;
    }
    return validities.concat([timeValid]).every(v => v !== false);
  }
  // Plain add mode:
  return validities.every(Boolean) && timeValid !== false;
}

export function recommendationNeeded(
  validity: StateValidity<FormFields>,
  roomValue: RoomCard | null,
  initialValues: PageData
) {
  return !roomValue && roomsDisplayed(validity, roomValue, initialValues);
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
  moved: Map<string, UpdateEventVariables[]>,
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
  moved: Map<string, UpdateEventVariables[]>,
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
