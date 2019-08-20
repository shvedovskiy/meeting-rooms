import { isToday, isFuture } from 'date-fns/esm';
import { StateValues } from 'components/utils/use-form';

import { splitTimeString, isTimeInPast, compareTimes } from 'service/dates';
import { UserData, RoomCard } from 'components/timesheet/types';
import { HOURS } from 'components/timesheet/common';

export interface EditFormFields {
  title: string;
  date: Date | null;
  startTime: string;
  endTime: string;
  time: string | null;
  participants: UserData[] | null;
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
  INVALID_TIME: 'Некорректное значение',
  START_PAST: 'Время начала не может быть в прошлом',
  END_PAST: 'Время окончания не может быть в прошлом',
  OFF_TIME: 'Нерабочее время',
  END_BEFORE_START: 'Время начала должно быть раньше времени окончания',
  TOO_MANY_USERS: 'Слишком много участников для выбранной переговорки',
};

function validateDate(value: Date | null) {
  if (!value) {
    return errors.EMPTY_DATE;
  }
  if (!isToday(value) && !isFuture(value)) {
    return errors.DATE_PAST;
  }
  return true;
}

function validatePastTime(
  time: 'start' | 'end',
  value: string,
  date: Date | null
) {
  if (
    date !== null &&
    validateDate(date) === true &&
    isToday(date) &&
    isTimeInPast(value)
  ) {
    return time === 'start' ? errors.START_PAST : errors.END_PAST;
  }
  return true;
}

function validateTime(time: 'start' | 'end', value: string | null) {
  if (value === null) {
    return errors.INVALID_TIME;
  }
  if (value.trim().length === 0) {
    return time === 'start' ? errors.EMPTY_START : errors.EMPTY_END;
  }
  const [hours, minutes] = splitTimeString(value);
  if (time === 'start') {
    if (
      hours < HOURS[0] ||
      (hours === HOURS[HOURS.length - 2] && minutes > 45) ||
      hours >= HOURS[HOURS.length - 1]
    ) {
      return errors.OFF_TIME;
    }
  } else {
    if (
      hours < HOURS[0] ||
      (hours === HOURS[0] && minutes < 15) ||
      (hours === HOURS[HOURS.length - 1] && minutes > 0) ||
      hours > HOURS[HOURS.length - 1]
    ) {
      return errors.OFF_TIME;
    }
  }
  return true;
}

export const validation = {
  title(value: string) {
    if (value.trim().length === 0) {
      return errors.EMPTY_TITLE;
    }
    return true;
  },
  date(value: Date | null, values: StateValues<EditFormFields>) {
    const valid = validateDate(value);
    if (valid !== true) {
      return valid;
    }
    const result: {
      date: true;
      startTime?: string | boolean;
      endTime?: string | boolean;
    } = { date: true };
    let startTimeValidity: string | true;
    let endTimeValidity: string | true;
    if (validateTime('start', values.startTime) === true) {
      startTimeValidity = validatePastTime('start', values.startTime!, value);
      result.startTime = startTimeValidity !== true ? startTimeValidity : true;
    }
    if (validateTime('end', values.endTime) === true) {
      endTimeValidity = validatePastTime('end', values.endTime!, value);
      result.endTime = endTimeValidity !== true ? endTimeValidity : true;
    }

    return result;
  },
  startTime(value: string, values: StateValues<EditFormFields>) {
    let valid = validateTime('start', value);
    if (valid !== true) {
      return {
        startTime: valid,
        time: true,
      };
    }

    let startTimeResult: string | true = true;
    valid = validatePastTime('start', value!, values.date);
    if (valid !== true) {
      startTimeResult = valid;
    }

    let time: string | boolean = true;
    const endTimeValid = validateTime('end', values.endTime);
    if (endTimeValid === true) {
      if (!compareTimes(value!, values.endTime!)) {
        time = errors.END_BEFORE_START;
      }
    }
    return {
      startTime: startTimeResult,
      time,
    };
  },
  endTime(value: string, values: StateValues<EditFormFields>) {
    let valid = validateTime('end', value);
    if (valid !== true) {
      return {
        endTime: valid,
        time: true,
      };
    }
    valid = validatePastTime('end', value!, values.date);
    if (valid !== true) {
      return {
        endTime: valid,
        time: true,
      };
    }

    let time: string | boolean = true;
    const startTimeValid = validateTime('start', values.startTime);
    if (startTimeValid === true) {
      if (!compareTimes(values.startTime!, value!)) {
        time = errors.END_BEFORE_START;
      }
    }
    return {
      endTime: true,
      time,
    };
  },
  participants(value: UserData[] | null, values: StateValues<EditFormFields>) {
    if (!value || value.length === 0) {
      return errors.EMPTY_USERS;
    }
    if (values.room) {
      const maxCapacity = values.room.maxCapacity;
      if (maxCapacity !== null && value.length > maxCapacity) {
        return errors.TOO_MANY_USERS;
      }
    }
    return true;
  },
  room(value: RoomCard | null) {
    if (!value) {
      return errors.EMPTY_ROOM;
    }
    return true;
  },
};
