import { PageData } from 'context/page-context';
import { FormFields } from '../form-common/validators';
import { StateValidity, StateValues } from 'components/common/use-form';
import { RoomCard } from 'components/timesheet/types';

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
