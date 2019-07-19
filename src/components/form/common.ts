import { isToday, isEqual, isAfter, isFuture } from 'date-fns/esm';
import {
  StateValues,
  FormState,
  StateErrors,
} from 'libs/react-use-form-state/dist';

import { splitTimeString } from 'service/dates';
import { UserData, RoomCard } from 'components/timesheet/types';

export interface EditFormFields {
  topic: string;
  date: Date | null;
  startTime: string;
  endTime: string;
  participants: UserData[] | null | undefined;
  room: RoomCard | null;
}

function compareTimes(value1: string, value2: string) {
  const dateStart = new Date(),
    dateEnd = new Date(dateStart.getTime());
  const [hours1, minutes1] = splitTimeString(value1);
  const [hours2, minutes2] = splitTimeString(value2);
  dateStart.setHours(hours1, minutes1);
  dateEnd.setHours(hours2, minutes2);
  if (isAfter(dateStart, dateEnd) || isEqual(dateStart, dateEnd)) {
    return false;
  }
  return true;
}

function validateTime(value: string) {
  if (!value || value.trim().length === 0) {
    return false;
  }
  return true;
}

export const validation = {
  topic(value: string) {
    if (value.trim().length === 0) {
      return 'Необходимо ввести название встречи';
    }
  },
  date(value: Date | null) {
    if (!value) {
      return 'Необходимо указать дату встречи';
    }
    if (!isToday(value) && !isFuture(value)) {
      return 'Прошедшая дата не может быть выбрана';
    }
  },
  startTime(
    value: string,
    values: StateValues<EditFormFields>,
    state: FormState<EditFormFields, StateErrors<EditFormFields, string>>
  ) {
    if (!validateTime(value)) {
      return 'Необходимо указать время начала';
    }

    if (validateTime(values.endTime)) {
      if (!compareTimes(value, values.endTime)) {
        state.setFields(null, {
          validity: {
            ...state.validity,
            endTime: false,
          },
          errors: {
            ...state.errors,
            endTime: undefined,
          },
        });
        return 'Время начала должно быть раньше времени окончания';
      }
      if (state.validity && state.validity.endTime === false) {
        state.setFields(null, {
          validity: {
            ...state.validity,
            endTime: true,
          },
        });
      }
    }
  },
  endTime(
    value: string,
    values: StateValues<EditFormFields>,
    state: FormState<EditFormFields, StateErrors<EditFormFields, string>>
  ) {
    if (!validateTime(value)) {
      return 'Необходимо указать время окончания';
    }

    if (validateTime(values.startTime)) {
      if (!compareTimes(values.startTime, value)) {
        state.setFields(null, {
          validity: {
            ...state.validity,
            startTime: false,
          },
          errors: {
            ...state.errors,
            startTime: undefined,
          },
        });
        return 'Время окончания должно быть позже времени начала';
      }
      if (state.validity && state.validity.startTime === false) {
        state.setFields(null, {
          validity: {
            ...state.validity,
            startTime: true,
          },
        });
      }
    }
  },
  participants(
    value: UserData[] | null | undefined,
    values: StateValues<EditFormFields>
  ) {
    if (!value) {
      return 'Необходимо добавить участников';
    }
    if (values.room) {
      const maxCapacity = values.room.capacity.get('max');
      if (maxCapacity && value.length > maxCapacity) {
        return 'Слишком много участников для выбранной переговорки';
      }
    }
  },
  room(value: RoomCard | null) {
    if (!value) {
      return 'Необходимо выбрать переговорку';
    }
  },
};
