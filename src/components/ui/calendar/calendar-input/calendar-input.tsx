import React, { useState } from 'react';
import { DayModifiers, ClassNames, InputClassNames } from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import { Input } from 'components/ui/input/ref-input';
import { Size } from 'context/size-context';
import { MONTHS, LABELS, Weekday } from '../common';
import { CalendarIcon } from './calendar-icon';
import classes from '../calendar.module.scss';
import inputClasses from './calendar-input.module.scss';

type Props = {
  size?: Size;
  initialDate?: Date;
  onChange?: (newDate: Date) => void;
};

export const CalendarInput = (props: Props) => {
  const now = new Date();
  const { size = 'default', initialDate, onChange } = props;
  const [selected, setSelected] = useState(now);

  function handleDayChange(date: Date, modifiers: DayModifiers) {
    if (!modifiers.disabled && !modifiers.selected) {
      setSelected(date);
      if (onChange) {
        onChange(date);
      }
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
        sideIcon: <CalendarIcon size="large" className={inputClasses.icon} />,
      }}
      format={'DD/MM/YYYY'}
      placeholder={''}
      onDayChange={handleDayChange}
      value={initialDate}
    />
  );
};
