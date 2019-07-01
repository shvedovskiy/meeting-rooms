import React, { useState } from 'react';
import DayPicker, { DayModifiers, ClassNames } from 'react-day-picker';

import classes from './calendar.module.scss';
import { MONTHS, LABELS, Weekday } from './common';

type Props = {
  initialDate?: Date;
  onChange?: (newDate: Date) => void;
};

export const Calendar = (props: Props) => {
  const now = new Date();
  const { initialDate = now, onChange } = props;
  const [selected, setSelected] = useState(initialDate);

  function handleDayClick(date: Date, modifiers: DayModifiers) {
    if (!modifiers.disabled && !modifiers.selected) {
      setSelected(date);
      if (onChange) {
        onChange(date);
      }
    }
  }

  return (
    <DayPicker
      // @ts-ignore
      classNames={classes as ClassNames}
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
      months={MONTHS}
      onDayClick={handleDayClick}
      showOutsideDays
      weekdayElement={Weekday}
    />
  );
};
