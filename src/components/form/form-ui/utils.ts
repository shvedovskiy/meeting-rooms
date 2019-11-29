import { PageData } from 'context/page-context';
import {
  FormFields,
  FormErrors,
  blurValidation,
  emptyValidation,
} from '../form-common/validators';
import { StateValidity, StateValues } from 'components/common/use-form';
import { RoomCard, Event, RoomData } from 'components/timesheet/types';
import { UpdateEventVariables } from 'service/apollo/mutations';

export type MovedEvent = UpdateEventVariables & { prevRoom: string };
export type RoomMovedEvents = Map<string, UpdateEventVariables[]>;
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

export function roomsShouldDisplay(
  formValidity: StateValidity<FormErrors>,
  formValues: StateValues<FormFields>,
  initialFormValues: PageData
) {
  const {
    startTime: startTimeValid,
    endTime: endTimeValid,
    time: timeValid,
    date: dateValid,
    users: usersValid,
  } = formValidity;
  const {
    startTime: startTimeValue,
    endTime: endTimeValue,
    date: dateValue,
    users: usersValue,
    room: roomValue,
  } = formValues;

  // Initial state:
  if (Object.values(formValidity).every(v => typeof v === 'undefined')) {
    return initialFormValues.hasOwnProperty('room');
  }

  const validitiesToCheck = [startTimeValid, endTimeValid, dateValid];
  // Room is not selected:
  if (!roomValue) {
    validitiesToCheck.push(usersValid);
  }

  // Edit/partial add mode:
  if (initialFormValues.room) {
    if (validitiesToCheck.every(v => typeof v === 'undefined')) {
      return formValues.room !== null;
    }
    validitiesToCheck.push(timeValid);
    return (
      validitiesToCheck.every(v => v !== false) &&
      [dateValue, startTimeValue, endTimeValue, usersValue].every(Boolean)
    );
  }
  // Plain add mode:
  return validitiesToCheck.every(Boolean) && timeValid !== false;
}

const checkValidationResult = (
  result: boolean | string | { [field: string]: boolean | string }
): boolean => {
  if (typeof result === 'boolean') {
    return result;
  }
  if (typeof result === 'string') {
    return false;
  }
  for (const res of Object.values(result)) {
    if (typeof res === 'boolean' && res === false) {
      return false;
    }
    if (typeof res === 'string') {
      return false;
    }
  }
  return true;
};

export function recommendationNeeded(
  formValidity: StateValidity<FormErrors>,
  formValues: StateValues<FormFields>,
  initialValues: PageData
) {
  const { startTime, endTime, date, room } = formValues;
  if (room || !roomsShouldDisplay(formValidity, formValues, initialValues)) {
    return false;
  }
  const emptyValidationResult = emptyValidation(formValues);
  if (
    ['date', 'startTime', 'endTime'].some(f =>
      emptyValidationResult.hasOwnProperty(f)
    )
  ) {
    return false;
  }
  const blurValidationResults = [
    blurValidation.date(date, formValues),
    blurValidation.startTime(startTime, formValues),
    blurValidation.endTime(endTime, formValues),
  ];
  for (const res of blurValidationResults) {
    if (!checkValidationResult(res)) {
      return false;
    }
  }

  return true;
}

export function handleFormChange(
  changed: Partial<FormFields>,
  formState: StateValues<FormFields>
) {
  if (
    formState.room &&
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
  moved: RoomMovedEvents,
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
  moved: RoomMovedEvents,
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
