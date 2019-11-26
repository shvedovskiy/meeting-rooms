import React, { useState, forwardRef, FocusEventHandler } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { startOfDay } from 'date-fns/esm';

import { Weekday } from './weekday';
import { MONTHS, LABELS } from './utils';
import classes from './calendar.module.scss';

type Props = {
  className?: string;
  initialDate?: Date;
  onBlur?: FocusEventHandler;
  onChange: (newDate: Date) => void;
};

export const Calendar = forwardRef<DayPicker, Props>((props, outerRef) => {
  const now = new Date();
  const { className, initialDate = now, onBlur, onChange } = props;
  const [selected, setSelected] = useState(initialDate);

  function handleDayClick(date: Date, modifiers: DayModifiers) {
    if (!modifiers.disabled && !modifiers.selected) {
      setSelected(date);
      onChange(startOfDay(date));
    }
  }

  return (
    <DayPicker
      className={className}
      classNames={classes}
      firstDayOfWeek={1}
      fromMonth={now}
      labels={LABELS}
      locale="ru"
      modifiers={{
        [classes.disabled]: {
          before: now,
        },
        [classes.selected]: selected,
      }}
      month={selected}
      months={MONTHS}
      ref={outerRef}
      onBlur={onBlur}
      onDayClick={handleDayClick}
      showOutsideDays
      weekdayElement={Weekday}
    />
  );
});
