import React, { FC } from 'react';
import { WeekdayElementProps } from 'react-day-picker';
import cn from 'classnames';

import { WEEKDAYS_LONG, WEEKDAYS_SHORT } from './utils';
import classes from './calendar.module.scss';

export const Weekday: FC<WeekdayElementProps> = ({
  weekday,
  className: defaultClass,
}) => {
  const className = cn(defaultClass, {
    [classes.weekend]: weekday === 6 || weekday === 0,
  });
  return (
    <div className={className} title={WEEKDAYS_LONG[weekday]}>
      {WEEKDAYS_SHORT[weekday]}
    </div>
  );
};
