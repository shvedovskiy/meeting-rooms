import React, { useState, useEffect, useRef } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { startOfDay } from 'date-fns/esm';

import { Weekday } from './weekday';
import { MONTHS, LABELS } from './utils';
import classes from './calendar.module.scss';

type Props = {
  className?: string;
  initialDate?: Date;
  onBlur: () => void;
  onChange: (newDate: Date) => void;
};

export const Calendar = (props: Props) => {
  const now = new Date();
  const { className, initialDate = now, onBlur, onChange } = props;
  const [selected, setSelected] = useState(initialDate);
  const pickerRef = useRef<DayPicker>(null);

  useEffect(() => {
    function checkOutsideClick(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.dayPicker.contains(event.target as Element)
      ) {
        onBlur();
      }
    }
    window.addEventListener('click', checkOutsideClick);
    return () => window.removeEventListener('click', checkOutsideClick);
  });

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
      ref={pickerRef}
      onBlur={onBlur}
      onDayClick={handleDayClick}
      showOutsideDays
      weekdayElement={Weekday}
    />
  );
};
