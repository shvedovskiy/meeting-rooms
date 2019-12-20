import React, { useState, useRef } from 'react';
import { DayModifiers, DateUtils, DayPickerProps } from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { startOfDay } from 'date-fns/esm';

import { OverlayComponent } from './overlay';
import { Input } from 'components/ui/input/ref-input';
import { Icon } from 'components/ui/icon/icon';
import { Size } from 'context/size-context';
import { Weekday } from '../weekday';
import { MONTHS, LABELS, FORMAT, isDateIncomplete } from '../utils';
import { format, parse } from 'service/dates';
import inputClasses from './calendar-input.module.scss';
import calendarClasses from '../calendar.module.scss';

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
  const input = useRef<DayPickerInput>(null);
  const { size = Size.DEFAULT, id, value, error, onChange, onBlur } = props;
  const [selected, setSelected] = useState<Date | null>(null);

  function handleDayChange(date: Date | null = null, modifiers: DayModifiers) {
    if (!modifiers.disabled && !modifiers.selected) {
      setSelected(date);

      let result: Date | null | undefined = undefined;
      if (date == null) {
        const inputValue = input.current!.getInput().value as string;
        if (isDateIncomplete(inputValue)) {
          result = null;
        }
      } else {
        result = startOfDay(date);
      }
      onChange(result);
    }
  }

  const dayPickerProps: DayPickerProps = {
    classNames: calendarClasses,
    firstDayOfWeek: 1,
    fromMonth: now,
    labels: LABELS,
    locale: 'ru',
    modifiers: {
      [calendarClasses.disabled]: {
        before: now,
      },
    },
    month: selected ?? now,
    months: MONTHS,
    onDayClick: () => {
      input.current!.getInput().blur();
    },
    showOutsideDays: true,
    weekdayElement: Weekday,
  };
  if (selected) {
    dayPickerProps.modifiers![calendarClasses.selected] = selected;
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
      overlayComponent={OverlayComponent}
      value={value || undefined}
    />
  );
};
