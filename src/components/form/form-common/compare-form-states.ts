import { EventInput } from 'components/timesheet/types';
import { PageData } from 'context/page-context';
import { FormFields } from './validators';

export function compareFormStates(formValues: FormFields, initialValues: PageData) {
  const { title, date, startTime, endTime, users, room } = formValues;
  const event = {
    title,
    date,
    startTime,
    endTime,
  };

  const diff: {
    input?: Partial<EventInput>;
    roomId?: string;
    userIds?: string[];
  } = {};

  const inputFields = Object.keys(event).reduce((acc, name) => {
    if (initialValues.hasOwnProperty(name) && event[name as keyof typeof event] !== null) {
      if (
        (name === 'date' && event.date!.getTime() === initialValues.date!.getTime()) ||
        event[name as keyof typeof event] === initialValues[name as keyof typeof event]
      ) {
        return acc;
      }
    }

    return {
      ...acc,
      [name]: event[name as keyof typeof event],
    };
  }, {});
  if (Object.keys(inputFields).length !== 0) {
    diff.input = inputFields;
  }

  if (initialValues.hasOwnProperty('room') && room !== null) {
    if (initialValues.room!.id !== room.id) {
      diff.roomId = room.id;
    }
  }

  if (initialValues.hasOwnProperty('users') && users !== null) {
    if (
      initialValues.users!.length !== users.length ||
      users.some(u1 => !initialValues.users!.find(u2 => u2.id === u1.id))
    ) {
      diff.userIds = users.map(u => u.id);
    }
  }

  return diff;
}
