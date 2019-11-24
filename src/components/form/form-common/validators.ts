import { isToday, isFuture } from 'date-fns/esm';

import { StateValues } from 'components/common/use-form';
import {
  splitTimeString,
  isPastTime,
  compareTimeStrings,
  HOURS,
} from 'service/dates';
import { UserData, RoomCard } from 'components/timesheet/types';

export interface FormFields {
  title: string;
  date: Date | null | undefined;
  startTime: string;
  endTime: string;
  users: UserData[] | null;
  room: RoomCard | null;
}

export type FormErrors = {
  form: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  time: string;
  users: string;
  room: string;
};

const errors = {
  EMPTY_FIELDS: 'Необходимо заполнить все поля',
  DATE_PAST: 'Прошедшая дата не может быть выбрана',
  START_PAST: 'Время начала не может быть в прошлом',
  END_PAST: 'Время окончания не может быть в прошлом',
  OFF_TIME: 'Нерабочее время',
  END_BEFORE_START: 'Время начала должно быть раньше времени окончания',
  TOO_MANY_USERS: 'Слишком много участников для выбранной переговорки',
};

// DATE:
function dateIsEmpty(date: Date | null | undefined): date is undefined {
  return date === undefined;
}

function dateIsIncorrect(date: Date | null | undefined): date is null {
  if (!dateIsEmpty(date)) {
    return date === null;
  }
  return false;
}

function dateInPast(date: Date) {
  return !isToday(date) && !isFuture(date);
}

function dateIsValid(date: Date | null | undefined): date is Date {
  return !dateIsEmpty(date) && !dateIsIncorrect(date);
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

function timeIsInPast(time: string, date: Date | null | undefined) {
  return dateIsValid(date) && isToday(date) && isPastTime(time);
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
  title() {
    return { title: true, form: true };
  },
  date(date: Date | null | undefined) {
    const valid = { form: true, date: true };
    if (dateIsIncorrect(date)) {
      return Object.assign(valid, { date: false });
    }
    return valid;
  },
  startTime(startTime: string | null) {
    const valid = { startTime: true, time: true, form: true };
    if (timeIsIncorrect(startTime)) {
      return Object.assign(valid, { startTime: false });
    }
    return valid;
  },
  endTime(endTime: string | null) {
    const valid = { endTime: true, time: true, form: true };
    if (timeIsIncorrect(endTime)) {
      return Object.assign(valid, { endTime: false });
    }
    return valid;
  },
  users(users: UserData[] | null, values: StateValues<FormFields>) {
    const valid = { form: true, users: true };
    if (usersAreEmpty(users) || roomIsEmpty(values.room)) {
      return valid;
    }
    const maxCapacity = values.room.maxCapacity;
    if (maxCapacity !== null && users.length > maxCapacity) {
      Object.assign(valid, { users: errors.TOO_MANY_USERS });
    }
    return valid;
  },
  room(value: RoomCard | null, values: StateValues<FormFields>) {
    const valid = { room: true, form: true };
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
  date(date: Date | null | undefined, values: StateValues<FormFields>) {
    if (dateIsEmpty(date)) {
      return true;
    }
    if (dateIsIncorrect(date)) {
      return false;
    }

    const valid = { date: true };
    if (dateInPast(date)) {
      return Object.assign(valid, { date: errors.DATE_PAST });
    }
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
};

export function validateOnSubmit(values: StateValues<FormFields>) {
  const valid = {};
  if (values.hasOwnProperty('title') && values.title.trim().length === 0) {
    Object.assign(valid, { title: false });
  }
  if (values.hasOwnProperty('date') && dateIsEmpty(values.date)) {
    Object.assign(valid, { date: false });
  }
  if (values.hasOwnProperty('startTime') && timeIsEmpty(values.startTime)) {
    Object.assign(valid, { startTime: false });
  }
  if (values.hasOwnProperty('endTime') && timeIsEmpty(values.endTime)) {
    Object.assign(valid, { endTime: false });
  }
  if (values.hasOwnProperty('users') && usersAreEmpty(values.users)) {
    Object.assign(valid, { users: false });
  }
  if (values.hasOwnProperty('room') && roomIsEmpty(values.room)) {
    Object.assign(valid, { room: false });
  }
  if (Object.keys(valid).length > 0) {
    Object.assign(valid, { form: errors.EMPTY_FIELDS });
  }
  return valid;
}
