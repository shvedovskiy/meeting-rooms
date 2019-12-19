import React, { useState, useRef, FocusEventHandler, FocusEvent } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { startOfDay } from 'date-fns/esm';

import { Weekday } from './weekday';
import { MONTHS, LABELS } from './utils';
import { useOnclickOutside } from 'components/common/use-outside-click';
import classes from './calendar.module.scss';

type Props = {
  className?: string;
  initialDate?: Date;
  onBlur: FocusEventHandler;
  onClose: (event: MouseEvent | TouchEvent) => void;
  onChange: (newDate: Date) => void;
};

export const Calendar = (props: Props) => {
  const now = new Date();
  const { className, initialDate = now, onBlur, onClose, onChange } = props;
  const [selected, setSelected] = useState(initialDate);
  const pickerRef = useRef<DayPicker>(null);

  useOnclickOutside<DayPicker>(pickerRef, onClose, 'dayPicker');

  function handleDayClick(date: Date, modifiers: DayModifiers) {
    if (!modifiers[classes.disabled] && !modifiers[classes.selected]) {
      setSelected(date);
      onChange(startOfDay(date));
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const target = event.relatedTarget;
    if (!target || !pickerRef.current?.dayPicker.contains(target as HTMLElement)) {
      onBlur(event);
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
      onBlur={handleBlur}
      onDayClick={handleDayClick}
      showOutsideDays
      weekdayElement={Weekday}
    />
  );
};
