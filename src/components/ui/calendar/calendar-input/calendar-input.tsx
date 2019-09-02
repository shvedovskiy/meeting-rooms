import React, { useState } from 'react';
import { DayModifiers, ClassNames, InputClassNames } from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {
  format as dateFnsFormat,
  parse as dateFnsParse,
  isValid,
  startOfDay,
} from 'date-fns/esm';
import ruLocale from 'date-fns/locale/ru';

import { Input } from 'components/ui/input/ref-input';
import { Icon } from 'components/ui/icon/icon';
import { Size } from 'context/size-context';
import { MONTHS, LABELS, Weekday } from '../common';
import classes from '../calendar.module.scss';
import inputClasses from './calendar-input.module.scss';

type Props = {
  size?: Size;
  id?: string;
  value?: Date | null;
  error?: boolean;
  onChange: (newDate: Date | null) => void;
};

function formatDate(date: Date, format: string) {
  return dateFnsFormat(date, format, { locale: ruLocale });
}

function parseDate(str: string, format: string) {
  const parsed = dateFnsParse(str, format, Date.now(), { locale: ruLocale });
  if (isValid(parsed)) {
    return parsed;
  }
}

export const CalendarInput = (props: Props) => {
  const now = new Date();
  const { size = 'default', id, value, error, onChange } = props;
  const [selected, setSelected] = useState(now);

  function handleDayChange(date: Date | null, modifiers: DayModifiers) {
    if (!modifiers.disabled && !modifiers.selected) {
      if (date) {
        setSelected(date);
      }
      onChange(date !== null ? startOfDay(date) : null);
    }
  }

  const dayPickerProps = {
    // @ts-ignore
    classNames: classes as ClassNames,
    firstDayOfWeek: 1,
    fromMonth: now,
    labels: LABELS,
    locale: 'ru',
    modifiers: {
      [classes.disabled]: {
        before: now,
      },
      [classes.selected]: selected,
    },
    months: MONTHS,
    showOutsideDays: true,
    weekdayElement: Weekday,
  };

  return (
    <DayPickerInput
      // @ts-ignore
      classNames={inputClasses as InputClassNames}
      component={Input}
      dayPickerProps={dayPickerProps}
      inputProps={{
        size,
        id,
        error,
        sideIcon: <Icon name="calendar" size="large" />,
      }}
      format={'d MMMM, y'}
      formatDate={formatDate}
      parseDate={parseDate}
      placeholder={''}
      onDayChange={handleDayChange}
      value={value || undefined}
    />
  );
};
