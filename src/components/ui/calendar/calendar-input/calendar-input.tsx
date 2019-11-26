import React, { useState, createRef } from 'react';
import { DayModifiers, DateUtils, DayPickerProps } from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { startOfDay } from 'date-fns/esm';

import { Input } from 'components/ui/input/ref-input';
import { Icon } from 'components/ui/icon/icon';
import { Size } from 'context/size-context';
import { Weekday } from '../weekday';
import {
  MONTHS,
  LABELS,
  FORMAT,
  isDateIncomplete,
  parseDate as parse,
  formatDate as format,
} from '../utils';
import classes from '../calendar.module.scss';
import inputClasses from './calendar-input.module.scss';

type Props = {
  size?: Size;
  id?: string;
  value?: Date | null;
  error?: boolean;
  onChange: (newDate: Date | null | undefined) => void;
  onBlur: () => void;
};

function parseDate(str: string, format: string) {
  const parsed = parse(str, format);
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
}

export const CalendarInput = (props: Props) => {
  const now = new Date();
  const input = createRef<DayPickerInput>();
  const { size = 'default', id, value, error, onChange, onBlur } = props;
  const [selected, setSelected] = useState<Date | null>(now);

  function handleDayChange(date: Date | null = null, modifiers: DayModifiers) {
    if (!modifiers.disabled && !modifiers.selected) {
      setSelected(date);

      let result: Date | null | undefined = null;
      if (date == null) {
        const inputValue = input.current!.getInput().value as string;
        if (isDateIncomplete(inputValue)) {
          result = undefined;
        }
      } else {
        result = startOfDay(date);
      }
      onChange(result);
    }
  }

  const dayPickerProps: DayPickerProps = {
    classNames: classes,
    firstDayOfWeek: 1,
    fromMonth: now,
    labels: LABELS,
    locale: 'ru',
    modifiers: {
      [classes.disabled]: {
        before: now,
      },
    },
    month: selected || now,
    months: MONTHS,
    showOutsideDays: true,
    weekdayElement: Weekday,
  };
  if (selected) {
    dayPickerProps.modifiers![classes.selected] = selected;
  }

  return (
    <DayPickerInput
      classNames={inputClasses}
      component={Input}
      dayPickerProps={dayPickerProps}
      inputProps={{
        size,
        id,
        error,
        sideIcon: <Icon name="calendar" size="large" />,
        onBlur,
      }}
      format={FORMAT}
      formatDate={format}
      parseDate={parseDate}
      placeholder={''}
      ref={input}
      onDayChange={handleDayChange}
      value={value || undefined}
    />
  );
};
