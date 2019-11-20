import { isToday, isFuture } from 'date-fns/esm';
import { Mutable } from 'utility-types';

import { StateValues, StateErrors } from 'components/common/use-form';
import {
  splitTimeString,
  isPastTime,
  compareTimeStrings,
  HOURS,
} from 'service/dates';
import { UserData, RoomCard } from 'components/timesheet/types';

export interface FormFields {
  title: string;
  date: Date | null;
  startTime: string;
  endTime: string;
  time: string | null;
  users: UserData[] | null;
  room: RoomCard | null;
}

const errors = {
  EMPTY_TITLE: 'Необходимо ввести название встречи',
  EMPTY_DATE: 'Необходимо указать дату встречи',
  EMPTY_START: 'Необходимо указать время начала',
  EMPTY_END: 'Необходимо указать время окончания',
  EMPTY_USERS: 'Необходимо добавить участников',
  EMPTY_ROOM: 'Необходимо выбрать переговорку',
  DATE_PAST: 'Прошедшая дата не может быть выбрана',
  START_PAST: 'Время начала не может быть в прошлом',
  END_PAST: 'Время окончания не может быть в прошлом',
  OFF_TIME: 'Нерабочее время',
  END_BEFORE_START: 'Время начала должно быть раньше времени окончания',
  TOO_MANY_USERS: 'Слишком много участников для выбранной переговорки',
};

// DATE:
function dateIsEmpty(date: Date | null): date is null {
  return date == null;
}

function dateInPast(date: Date) {
  return !isToday(date) && !isFuture(date);
}

// TIME:
function timeIsIncorrect(time: string | null): time is null {
  if (time == null) {
    return true;
  }
  if (!timeIsEmpty(time)) {
    const [, minutes] = splitTimeString(time);
    if (minutes % 15 !== 0) {
      return true;
    }
  }
  return false;
}

function timeIsEmpty(time: string) {
  return time.trim().length === 0 || splitTimeString(time).some(Number.isNaN);
}

function timeIsOff(time: string) {
  const [hours, minutes] = splitTimeString(time);
  if (time === 'start') {
    if (
      hours < HOURS[0] ||
      (hours === HOURS[HOURS.length - 2] && minutes > 45) ||
      hours >= HOURS[HOURS.length - 1]
    ) {
      return true;
    }
  } else {
    if (
      hours < HOURS[0] ||
      (hours === HOURS[0] && minutes < 15) ||
      (hours === HOURS[HOURS.length - 1] && minutes > 0) ||
      hours > HOURS[HOURS.length - 1]
    ) {
      return true;
    }
  }
  return false;
}

function timeIsInPast(time: string, date: Date | null) {
  return !dateIsEmpty(date) && isToday(date) && isPastTime(time);
}

function timeIsValid(value: string | null) {
  return !timeIsIncorrect(value) && !timeIsEmpty(value) && !timeIsOff(value);
}

// USERS:
function usersAreEmpty(users: UserData[] | null): users is null {
  return users == null || users.length === 0;
}

// ROOM:
function roomIsEmpty(room: RoomCard | null): room is null {
  return room == null;
}

// VALIDATORS:
export const validation = {
  date(date: Date | null, values: StateValues<FormFields>) {
    if (dateIsEmpty(date)) {
      return true;
    }
    if (dateInPast(date)) {
      return errors.DATE_PAST;
    }
    const valid = { date: true };
    if (timeIsValid(values.startTime)) {
      Object.assign(valid, {
        startTime: timeIsInPast(values.startTime, date)
          ? errors.START_PAST
          : true,
      });
    }
    if (timeIsValid(values.endTime)) {
      Object.assign(valid, {
        endTime: timeIsInPast(values.endTime, date) ? errors.END_PAST : true,
      });
    }
    return valid;
  },
  startTime(startTime: string | null) {
    const valid = { time: true, startTime: true };
    if (timeIsIncorrect(startTime)) {
      return Object.assign(valid, { startTime: false });
    }
    return valid;
  },
  endTime(endTime: string | null) {
    const valid = { time: true, endTime: true };
    if (timeIsIncorrect(endTime)) {
      return Object.assign(valid, { endTime: false });
    }
    return valid;
  },
  users(users: UserData[] | null, values: StateValues<FormFields>) {
    if (usersAreEmpty(users) || roomIsEmpty(values.room)) {
      return true;
    }
    const maxCapacity = values.room.maxCapacity;
    if (maxCapacity !== null && users.length > maxCapacity) {
      return errors.TOO_MANY_USERS;
    }
    return true;
  },
  room(value: RoomCard | null, values: StateValues<FormFields>) {
    const valid = { room: true };
    if (roomIsEmpty(value) && !usersAreEmpty(values.users)) {
      Object.assign(valid, { users: true });
    }
    return valid;
  },
};

export const blurValidation = {
  startTime(startTime: string | null, values: StateValues<FormFields>) {
    if (timeIsIncorrect(startTime)) {
      return false;
    }
    if (timeIsEmpty(startTime)) {
      return true;
    }
    if (timeIsOff(startTime)) {
      return { time: true, startTime: errors.OFF_TIME };
    }

    let startTimeResult: string | true = true;
    let time: string | boolean = true;
    if (timeIsInPast(startTime, values.date)) {
      startTimeResult = errors.START_PAST;
    }
    if (
      timeIsValid(values.endTime) &&
      !compareTimeStrings(startTime, values.endTime)
    ) {
      time = errors.END_BEFORE_START;
    }
    return {
      startTime: startTimeResult,
      time,
    };
  },
  endTime(endTime: string | null, values: StateValues<FormFields>) {
    if (timeIsIncorrect(endTime)) {
      return false;
    }
    if (timeIsEmpty(endTime)) {
      return true;
    }
    if (timeIsOff(endTime)) {
      return { time: true, endTime: errors.OFF_TIME };
    }

    let endTimeResult: string | true = true;
    let time: string | boolean = true;
    if (timeIsInPast(endTime, values.date)) {
      endTimeResult = errors.START_PAST;
    }
    if (
      timeIsValid(values.endTime) &&
      !compareTimeStrings(values.startTime, endTime)
    ) {
      time = errors.END_BEFORE_START;
    }
    return {
      endTime: endTimeResult,
      time,
    };
  },
};

export function validateOnSubmit(values: StateValues<FormFields>) {
  const validationErrors: Mutable<StateErrors<FormFields>> = {};
  if (values.hasOwnProperty('title') && values.title.trim().length === 0) {
    validationErrors.title = errors.EMPTY_TITLE;
  }
  if (values.hasOwnProperty('date') && dateIsEmpty(values.date)) {
    validationErrors.date = errors.EMPTY_DATE;
  }
  if (values.hasOwnProperty('startTime') && timeIsEmpty(values.startTime)) {
    validationErrors.startTime = errors.EMPTY_START;
  }
  if (values.hasOwnProperty('endTime') && timeIsEmpty(values.endTime)) {
    validationErrors.endTime = errors.EMPTY_END;
  }
  if (values.hasOwnProperty('users') && usersAreEmpty(values.users)) {
    validationErrors.users = errors.EMPTY_USERS;
  }
  if (values.hasOwnProperty('room') && roomIsEmpty(values.room)) {
    validationErrors.room = errors.EMPTY_ROOM;
  }

  return validationErrors;
}
